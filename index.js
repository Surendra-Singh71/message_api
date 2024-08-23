const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;

app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "my_database",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.post("/api/messages", (req, res) => {
  const { name, email, phone, msg } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const query =
    "INSERT INTO messages (name, email, phone, msg) VALUES (?, ?, ?, ?)";
  const values = [name, email, phone, msg];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to insert data" });
    }
    res.status(201).json({
      message: "Data inserted successfully",
      data: { id: result.insertId, name, email, phone, msg },
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
