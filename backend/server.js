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

// Example query to create a table if it doesn’t already exist
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

// Create table for bloodwork
db.run(`
  CREATE TABLE IF NOT EXISTS bloodwork (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    test_date DATE,
    notes TEXT,
    FOREIGN KEY(pet_id) REFERENCES pets(id) ON DELETE CASCADE
  );
`);

// Create table for vaccines
db.run(`
  CREATE TABLE IF NOT EXISTS vaccines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    vaccine_name TEXT,
    last_vaccine_date DATE,
    next_vaccine_date DATE,
    FOREIGN KEY(pet_id) REFERENCES pets(id) ON DELETE CASCADE
  );
`);

// Create table for medication routine
db.run(`
  CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    medication_name TEXT,
    frequency TEXT,
    FOREIGN KEY(pet_id) REFERENCES pets(id) ON DELETE CASCADE
  );
`);

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

// Add a new bloodwork entry
app.post("/api/bloodwork", (req, res) => {
  const { pet_id, test_date, notes } = req.body;
  const sql = `INSERT INTO bloodwork (pet_id, test_date, notes) VALUES (?, ?, ?)`;
  db.run(sql, [pet_id, test_date, notes], function(err) {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err.message });
    }
    res.status(201).json({ message: "Bloodwork added successfully", id: this.lastID });
  });
});

// Add a new vaccine entry
app.post("/api/vaccines", (req, res) => {
  const { pet_id, vaccine_name, last_vaccine_date, next_vaccine_date } = req.body;
  const sql = `INSERT INTO vaccines (pet_id, vaccine_name, last_vaccine_date, next_vaccine_date) VALUES (?, ?, ?, ?)`;
  db.run(sql, [pet_id, vaccine_name, last_vaccine_date, next_vaccine_date], function(err) {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err.message });
    }
    res.status(201).json({ message: "Vaccine added successfully", id: this.lastID });
  });
});

// Add a new medication entry
app.post("/api/medications", (req, res) => {
  const { pet_id, medication_name, frequency } = req.body;
  const sql = `INSERT INTO medications (pet_id, medication_name, frequency) VALUES (?, ?, ?)`;
  db.run(sql, [pet_id, medication_name, frequency], function(err) {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err.message });
    }
    res.status(201).json({ message: "Medication added successfully", id: this.lastID });
  });
});

// Edit a bloodwork entry
app.put("/api/bloodwork/:id", (req, res) => {
  const { id } = req.params;
  const { test_date, notes } = req.body;
  const sql = `UPDATE bloodwork SET test_date = ?, notes = ? WHERE id = ?`;
  db.run(sql, [test_date, notes, id], function(err) {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err.message });
    }
    res.status(200).json({ message: "Bloodwork updated successfully" });
  });
});

// Edit a vaccine entry
app.put("/api/vaccines/:id", (req, res) => {
  const { id } = req.params;
  const { vaccine_name, last_vaccine_date, next_vaccine_date } = req.body;
  const sql = `UPDATE vaccines SET vaccine_name = ?, last_vaccine_date = ?, next_vaccine_date = ? WHERE id = ?`;
  db.run(sql, [vaccine_name, last_vaccine_date, next_vaccine_date, id], function(err) {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err.message });
    }
    res.status(200).json({ message: "Vaccine updated successfully" });
  });
});

// Edit a medication entry
app.put("/api/medications/:id", (req, res) => {
  const { id } = req.params;
  const { medication_name, frequency } = req.body;
  const sql = `UPDATE medications SET medication_name = ?, frequency = ? WHERE id = ?`;
  db.run(sql, [medication_name, frequency, id], function(err) {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err.message });
    }
    res.status(200).json({ message: "Medication updated successfully" });
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

// Get all pets for a specific user
app.get("/api/pets/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT * FROM pets WHERE owner_id = ?`;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err.message });
    }
    res.json(rows);
  });
});

// Get bloodwork for a specific pet
app.get("/api/bloodwork/:petId", (req, res) => {
  const petId = req.params.petId;
  const sql = `SELECT * FROM bloodwork WHERE pet_id = ?`;
  db.all(sql, [petId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err.message });
    }
    res.json(rows);
  });
});

// Get vaccines for a specific pet
app.get("/api/vaccines/:petId", (req, res) => {
  const petId = req.params.petId;
  const sql = `SELECT * FROM vaccines WHERE pet_id = ?`;
  db.all(sql, [petId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err.message });
    }
    res.json(rows);
  });
});

// Get medications for a specific pet
app.get("/api/medications/:petId", (req, res) => {
  const petId = req.params.petId;
  const sql = `SELECT * FROM medications WHERE pet_id = ?`;
  db.all(sql, [petId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err.message });
    }
    res.json(rows);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
