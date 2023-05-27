const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mysql = require('mysql');
import  jwt  from "jsonwebtoken";

module.exports = (connection) => {
    // Register route
    router.get('/signup', (req, res) => {
      res.render('signup.hbs');
    });

router.post('/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Hash the password
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) throw err;

    // Store the user in the database
    const sql = 'INSERT INTO users (firstName, lastName, email, hashedpassword) VALUES (?, ?, ?, ?)';
    connection.query(sql, [firstName, lastName, email, hashedPassword], (err, result) => {
      if (err) throw err;
      res.send('Registration successful!');
    });
  });
});

// Login route
router.get('/login', (req, res) => {
  res.render('login.hbs');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  const sql = 'SELECT * FROM users WHERE username = ?';
  connection.query(sql, [username], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      res.send('Invalid username');
    } else {
      const hashedPassword = result[0].password;

      // Compare the password
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          res.send('Login successful!');
        } else {
          res.send('Invalid password');
        }
      });
      const token = jwt.sign({ id: result[0].id }, "apikey")

      const {password, ...others} = result[0]


      res.cookie("accessToken", token, {
          httpOnly: true,
      }).status(200).json(others)

    }
  });
});
// Update user
router.post('/update', (req, res) => {
  const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Authorized");

    jwt.verify(token, "apikey", (err, userInfo) => {
      if(err) return res.status(403).json("Token is not valid!");
      const sql = "UPDATE users SET `firstName`=?,`lastName`=?,`email`=?,`profilePic`=?, WHERE id=? ";
      connection.query(sql,
        [
          req.body.firstName,
          req.body.lastName,
          req.body.email,
          req.body.password,
          req.body.isAdmin,
          userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
});
 
  

return router

};

// Logout 
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    secure:true,
    sameSite:"none"
}).status(200).json("Logged out!")
})


// Add new villa/hotel
router.post('/villa', (req, res) => {
  const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Authorized");

    jwt.verify(token, "apikey", (err, userInfo) => {
      if(err) return res.status(403).json("Token is not valid!");

      const { name, location, rating, price, photos } = req.body;
      const sql = 'INSERT INTO villa (name, location, rating, price, photos) VALUES (?, ?, ?, ?, ?)';
      connection.query(sql,
        [
          name,
          location,
          rating,
          price,
          photos,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("Only Admin can update this information!");
      }
    );
  });
})