const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 3000;
const bcrypt = require("bcryptjs");


app.use(cors());

app.use(express.json()); // Middleware to parse JSON request bodies

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "srv1475.hstgr.io",
  user: "u381396247_NSasikumar",
  password: "Psn&paD?9",
  database: "u381396247_NSasikumar",
});

// insert new user details
app.post("/insertUser", async (req, res) => {
  const { userID, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO `UserDetails` (`userID`, `username`, `userPassword`) VALUES (?, ?, ?)";

  pool.execute(query, [userID, username, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to insert user details" });
    }

    res.json({ message: "User details inserted", result });
  });
});

// insert new sys details
app.post("/insertSys", async (req, res) => {
  const { sysID, sysData } = req.body;
  const newDate = new Date().toISOString().split("T")[0];
  const sysName = "System " + sysID;

  const query = "INSERT INTO `Systems` (`systemID`, `systemName`, `dateCreated`, `systemData`) VALUES (?, ?, ?, ?)";

  pool.execute(query, [sysID, sysName, newDate, sysData], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to insert user details" });
    }

    res.json({ message: "Sys details inserted", result });
  });
});

// insert new user-sys relation
app.post("/insertUserSysRelation", async (req, res) => {
  const { userID, sysID } = req.body;

  const query = "INSERT INTO `UserSystemRelation` (`userID`, `systemID`) VALUES (?, ?)";

  pool.execute(query, [userID, sysID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to insert user-sys relation details" });
    }

    res.json({ message: "user-sys relation details inserted", result });
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

// app.post("/checkUserDetails", (req, res) => {
//   const { username, password } = req.body;
//   const query = "SELECT * FROM `UserDetails` WHERE `username` = ?";

//   pool.execute(query, [username, password], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: "Failed to select user" });
//     }

//     res.json({ exists: result.length > 0 });
//   });
// });

app.post("/checkUserDetails", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const query = "SELECT * FROM `UserDetails` WHERE `username` = ?";

  pool.execute(query, [username], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to select user" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" }); //accessing someting that doesnt exist error
    }

    const storedHashedPassword = result[0].userPassword;
    const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" }); //bad request so bad parsing of data into request 
    }

    //console.log("Login successful" + result[0]);

    res.json({
      message: "Login successful",
      userID: result[0].userID,
      exists: true, // Indicate that the user exists and login is successful
    });
  });
});

//gets systems of user
app.post("/selectUserSystems", async (req, res) => {
  const { userID } = req.body;

  const query = `SELECT s.* FROM UserSystemRelation us JOIN Systems s ON us.systemID = s.systemID WHERE us.userID = ?`;

  pool.execute(query, [userID], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to select user" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" }); //accessing someting that doesnt exist error
    }

    //console.log("Login successful" + result[0]);

    res.json({
      message: "Login successful",
      result: result,
    });
  });
});

app.post("/selectSystem", async (req, res) => {
  const { sysID } = req.body;

  const query = "SELECT * FROM `Systems` WHERE `systemID` = ?";

  pool.execute(query, [sysID], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to select Sys" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Sys not found" }); //accessing someting that doesnt exist error
    }

    //console.log("Login successful" + result[0]);

    res.json({
      system: result
    });
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

// get the next system ID for sys creation
app.get("/getNextSysID", (req, res) => {
  const query = "SELECT COUNT(*) AS totSys FROM `Systems`";

  pool.execute(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to count IDs" }); //this is an internal server error
    }

    res.json({ totSys: result[0].totSys });
  });
});

app.listen(port, () => {
  //test server is running
  console.log(`Server is running check: http://localhost:${port}`);
});
