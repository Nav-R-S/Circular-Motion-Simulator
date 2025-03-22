require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const db = mysql.createConnection({
  host: "srv1475.hstgr.io",
  user: "u381396247_NSasikumar",
  password: "Psn&paD?9",
  database: "u381396247_NSasikumar",
});

db.connect((err) => {
  if (err) console.error("Database connection failed:", err);
  else console.log("Connected to MySQL");
});

const JWT_ACCESS_TOKEN = process.env.JWT_SECRET

// // 🔹 Register User
// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   db.query(
//     "INSERT INTO UserDetails (username, password) VALUES (?, ?)",
//     [username, hashedPassword],
//     (err) => {
//       if (err) return res.status(500).json({ message: "User already exists!" });
//       res.json({ message: "User registered successfully" });
//     }
//   );
// });

// 🔹 Login & Send JWT in HttpOnly Cookie
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM UserDetails WHERE username = ?",
    [username],
    async (err, result) => {
      if (err || result.length === 0)
        return res.status(400).json({ message: "User not found" });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });

      // Generate JWT Token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Set token in an HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access (XSS protection)
        secure: false, // Set to true in production (requires HTTPS)
        sameSite: "strict", // Prevents CSRF
        maxAge: 3600000, // 1 hour
      });

      res.json({ message: "Login successful" });
    }
  );
});

// 🔹 Logout (Clear Cookie)
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// 🔹 Middleware to Verify JWT in HttpOnly Cookie
const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from HttpOnly cookie

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
};

// 🔹 Protected Route (Only Accessible if Logged In)
app.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
