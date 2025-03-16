const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 5000;

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON data from the frontend
app.use(express.json());

const db = mysql.createConnection({
  host: "srv1475.hstgr.io",
  user: "u381396247_NSasikumar",
  password: "Psn&paD?9",
  database: "u381396247_NSasikumar",
});

// Check the connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to the database");
});

// API route to add a user
app.post("/add-userdata", (req, res) => {
  const { userID, username, password } = req.body;
  const sql = "INSERT INTO UserData (UserID	Username	Password) VALUES (?, ?, ?)"; // Change to UserData table
  db.query(sql, [userID, username, password], (err, result) => {
    if (err) throw err;
    res.json({ message: "User data added", userId: result.insertId });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
