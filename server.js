const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.set("view engine", "hbs");
app.set("views", "./view")
app.use("/public",express.static("public"));

// MySQL configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass123',
  database: 'test'
});

// Connect to the database
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the MySQL database');
});

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Set up routes
const indexRoute = require('./routes/index')(connection);
app.use('/', indexRoute);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
