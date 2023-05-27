const express = require("express");
const app = express();
const port = 3004
const mysql = require("./connection").con
const bodyParser = require('body-parser');
const { xss } = require('express-xss-sanitizer');

app.use(bodyParser.json({limit:'1kb'}));
app.use(bodyParser.urlencoded({extended: true, limit:'1kb'}));
app.use(xss());

    // configuration
app.set("view engine", "hbs");
app.set("views", "./view")

app.use("/public",express.static("public"));

// Routing
app.get("/", (req, res) => {
    res.render("index")
});

app.get("/add-villa", (req, res) => {
    res.render("add-villa")

});

app.get("/user-dashboard", (req, res) => {
    res.render("user-dashboard")

});

app.get("/all-villa", (req, res) => {
    res.render("all-villa")

});

app.get("/login", (req, res) => {
    res.render("login")

});

app.get("/search", (req, res) => {
    res.render("search")

});
app.get("/update", (req, res) => {
    res.render("update")

});

app.get("/delete", (req, res) => {
    res.render("delete")

});

app.get("/view", (req, res) => {
    let qry = "select * from test ";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("view", { data: results });
        }

    });

});

app.post("/register", (req, res) => {
    // fetching data from form
    const { firstName, lastName, email, password, password2 } = req.query

    // Sanitization XSS...
    let qry = "select * from signup where email=?";
    mysql.query(qry, [email], (err, results) => {
        if (err)
            throw err
        else {

            if (results.length > 0) {
                res.render("login", { checkmesg: true })
            } else {

                // insert query
                let qry2 = "insert into signup values(?,?,?,?,?)";
                mysql.query(qry2, [firstName, lastName, email, password, password2], (err, results) => {
                    if (results.affectedRows==0) {
                        res.render("login", { mesg: true })
                    }
                })
            }
        }
    })
});


app.get("/searchstudent", (req, res) => {
    // fetch data from the form


    const { phone } = req.query;

    let qry = "select * from test where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search", { mesg1: true, mesg2: false })
            } else {

                res.render("search", { mesg1: false, mesg2: true })

            }

        }
    });
})

app.get("/updatesearch", (req, res) => {

    const { phone } = req.query;

    let qry = "select * from test where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            } else {

                res.render("update", { mesg1: false, mesg2: true })

            }

        }
    });
})
app.get("/updatestudent", (req, res) => {
    // fetch data

    const { phone, name, gender } = req.query;
    let qry = "update test set username=?, gender=? where phoneno=?";

    mysql.query(qry, [name, gender, phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umesg: true })
            }
        }
    })

});

app.get("/removestudent", (req, res) => {

    // fetch data from the form


    const { phone } = req.query;

    let qry = "delete from test where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {

                res.render("delete", { mesg1: false, mesg2: true })

            }

        }
    });
});
//Create Server
app.listen(port, (err) => {
    if (err)
        throw err
    else
        console.log("Server is running at port %d:", port);
});