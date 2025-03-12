const mysql = require("mysql");

const con = mysql.createConnection({
  host: "srv1475.hstgr.io", 
  user: "u381396247_NSasikumar",
  password: "Psn&paD?9",
  database: "u381396247_NSasikumar",
});

con.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

con.query("SHOW TABLES", (err, result) => {
  if (err) {
    console.error("Error fetching tables:", err);
    return;
  }
  console.log("Tables in the database:", result);
});

con.end();
