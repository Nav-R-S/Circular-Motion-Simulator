const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); // Add this line
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors()); // This will allow all origins. You can configure it for specific origins too.

app.use(express.json()); // Middleware to parse JSON request bodies

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "srv1475.hstgr.io",
  user: "u381396247_NSasikumar",
  password: "Psn&paD?9",
  database: "u381396247_NSasikumar",
});

// insert new user details
app.post("/insertUser", (req, res) => {

  const { userID, username, password } = req.body;

  const query = "INSERT INTO `UserDetails` (`userID`, `username`, `userPassword`) VALUES (?, ?, ?)";

  pool.execute(query, [userID, username, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to insert user details" });
    }

    res.json({ message: "User details inserted", result });
  });
});

// checks if username exists
app.post("/checkUsernameExists", (req, res) => {
  const { username } = req.body;
  const query = "SELECT * FROM `UserDetails` WHERE `username` = ?";
  
  pool.execute(query, [username], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to select username" });
    }

    res.json({ exists: result.length > 0 });
  });
});

app.post("/checkUserDetails", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM `UserDetails` WHERE `username` = ? AND `userPassword` = ?";

  pool.execute(query, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to select user" });
    }

    res.json({ exists: result.length > 0 });
  });
});

// get the next user ID for user registration
app.get("/getNextUserID", (req, res) => {
  const query = "SELECT COUNT(*) AS totUsers FROM `UserDetails`";

  pool.execute(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to count IDs" });
    }

    res.json({ totUsers: result[0].totUsers });
  });
});


app.listen(port, () => { //test server is running
  console.log(`Server is running check: http://localhost:${port}`);
});

