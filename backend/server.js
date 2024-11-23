const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware to handle JSON data and CORS
app.use(express.json());
app.use(cors());

// Connect to SQLite3 database
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database: ", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// User Table
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Users table created or already exists.");
    }
  }
);

// Pets Table
db.run(
  `CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    breed TEXT NOT NULL,
    weight REAL NOT NULL,
    age INTEGER NOT NULL
  );`,
  (err) => {
    if (err) {
      console.error("Error creating pets table:", err.message);
    } else {
      console.log("Pets table created or already exists.");
    }
  }
);

// Signup route
app.post("/api/auth/signup", (req, res) => {
  const { name, username, password } = req.body;

  // Basic validation
  if (!name || !username || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Insert new user into the database
  const sql = `INSERT INTO users (name, username, password) VALUES (?, ?, ?)`;
  db.run(sql, [name, username, password], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ message: "Username already exists." });
      }
      return res.status(500).json({ message: "Error inserting user.", error: err.message });
    }
    res.status(201).json({ message: "Signup successful!", userId: this.lastID });
  });
});

// Define the login route
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Query the database to find the user
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Database error." });
    }
    if (!row) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Check if the password matches (Note: In a real application, you should hash passwords)
    if (row.password !== password) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // User authenticated successfully, you can return a token or user info
    // For simplicity, we'll just return a success message
    res.status(200).json({ message: "Login successful", user: { name: row.name, username: row.username } });
  });
});

// Example route to retrieve data from the database
app.get("/api/data", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => { // Changed "your_table" to "users"
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data: rows,
    });
  });
});

// Route to handle adding a new pet
app.post("/api/pets", (req, res) => {
  const { name, species, breed, weight, age } = req.body;

  // Basic validation
  if (!name || !species || !breed || !weight || !age) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Insert the new pet into the 'pets' table
  const query = `INSERT INTO pets (name, species, breed, weight, age) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [name, species, breed, weight, age], function (err) {
    if (err) {
      return res.status(500).json({ error: "Failed to add pet" });
    }
    // Respond with the newly added pet's ID
    res.status(201).json({ id: this.lastID, name, species, breed, weight, age });
  });
});

// Route to get all pets
app.get("/api/pets", (req, res) => {
  const query = "SELECT * FROM pets"; // SQL query to get all pets

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching pets:", err.message);
      return res.status(500).json({ error: "Failed to fetch pets" });
    }

    // Send the pet data as a JSON response
    res.status(200).json(rows);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
