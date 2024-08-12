require('dotenv').config()
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const Port = process.env.PORT || 3002

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DBPASSWORD)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DBPASSWORD,
  database: "flashcards_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

app.post("/adminlogin", (req, res) => {
  const { username, password } = req.body;

  // Hardcoded admin credentials (for demonstration purposes)
  const adminUsername = process.env.ADMINUSERNAME;
  const adminPassword = process.env.ADMINPASSWORD;

  // Check if the provided credentials match the admin credentials
  if (username === adminUsername && password === adminPassword) {
    res.send({ success: true, message: "Login successful" });
  } else {
    res.status(401).send({ success: false, message: "Invalid credentials" });
  }
});

app.get("/flashcards", (req, res) => {
  db.query("SELECT * FROM flashcards", (err, result) => {
    if (err) {
      console.error("Error querying flashcards:", err);
      res.status(500).send("Error fetching flashcards");
      return;
    }
    res.send(result);
  });
});

app.post("/flashcards", (req, res) => {
  const { question, answer } = req.body;
  db.query("INSERT INTO flashcards (question, answer) VALUES (?, ?)", [question, answer], (err, result) => {
    if (err) {
      console.error("Error inserting flashcard:", err);
      res.status(500).send("Error adding flashcard");
      return;
    }
    res.send(result);
  });
});

app.delete("/flashcards/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM flashcards WHERE id = ?", [id], (err, result) => {
    if (err) throw err;
    res.send({ message: "Flashcard deleted successfully" });
  });
});
app.listen(Port, () => {
  console.log(`Server started on port ${Port}`);
});
