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

// Vaccines Table
db.run(
  `CREATE TABLE IF NOT EXISTS vaccine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name INTEGER NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    vaccine TEXT NOT NULL,
    FOREIGN KEY (name) REFERENCES pets(name)
  );`,
  (err) => {
    if (err) {
      console.error("Error creating vaccines table:", err.message);
    } else {
      console.log("Vaccines table created or already exists.");
    }
  }
);

// Vaccine Post
app.post("/api/vaccine", (req, res) => {
  const { petId, date, notes, vaccine} = req.body;
  console.log(req.body)
  // Basic validation
  if (!petId || !date) {
    return res.status(400).json({ error: "Pet ID and date are required." });
  }

  // Check if pet_id exists in the pets table (optional)
  const petCheckQuery = `SELECT name FROM pets WHERE name = ?`;
  db.get(petCheckQuery, [petId], (err, pet) => {
    if (err) {
      return res.status(500).json({ error: "Error checking pet ID." });
    }

    if (!pet) {
      return res.status(404).json({ error: "Pet ID not found." });
    }

    // If pet exists, proceed to insert bloodwork record
    const insertQuery = `INSERT INTO vaccine (name, date, notes, vaccine) VALUES (?, ?, ?, ?)`;
    db.run(insertQuery, [petId, date, notes, vaccine || null], function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to add vaccine record." });
      }
      res.status(201).json({
        message: "Vaccine record added successfully.",
        vaccine_id: this.lastID,
        petId,
        vaccine,
        date,
        notes,
      });
    });
  });
});

// Vaccine Get
app.get("/api/vaccine", (req, res) => {
  const query = "SELECT * FROM vaccine"; // SQL query to get all vaccine data

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching vaccine:", err.message);
      return res.status(500).json({ error: "Failed to fetch vaccine" });
    }

    // Send the pet data as a JSON response
    res.status(200).json(rows);
  });
});

// Bloodwork Table
db.run(
  `CREATE TABLE IF NOT EXISTS bloodwork (
    bloodwork_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique ID for each bloodwork record
    name INTEGER NOT NULL,                       -- Foreign key referencing the pet
    date TEXT NOT NULL,                            -- Date of the bloodwork
    notes TEXT,                                    -- Optional notes
    FOREIGN KEY (name) REFERENCES pets (name)      -- Enforce relationship with pets table
  );`,
  (err) => {
    if (err) {
      console.error("Error creating bloodwork table:", err.message);
    } else {
      console.log("Bloodwork table created or already exists.");
    }
  }
);

// Bloodwork Get
app.get("/api/bloodwork", (req, res) => {
  const query = "SELECT * FROM bloodwork"; // SQL query to get all bloodwork data

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching bloodwork:", err.message);
      return res.status(500).json({ error: "Failed to fetch bloodwork" });
    }

    // Send the pet data as a JSON response
    res.status(200).json(rows);
  });
});

// Bloodwork Post
app.post("/api/bloodwork", (req, res) => {
  const { petId, date, notes } = req.body;
  // Basic validation
  if (!petId || !date) {
    return res.status(400).json({ error: "Pet ID and date are required." });
  }

  // Check if pet_id exists in the pets table (optional)
  const petCheckQuery = `SELECT name FROM pets WHERE name = ?`;
  db.get(petCheckQuery, [petId], (err, pet) => {
    if (err) {
      return res.status(500).json({ error: "Error checking pet ID." });
    }

    if (!pet) {
      return res.status(404).json({ error: "Pet ID not found." });
    }

    // If pet exists, proceed to insert bloodwork record
    const insertQuery = `INSERT INTO bloodwork (name, date, notes) VALUES (?, ?, ?)`;
    db.run(insertQuery, [petId, date, notes || null], function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to add bloodwork record." });
      }
      res.status(201).json({
        message: "Bloodwork record added successfully.",
        bloodwork_id: this.lastID,
        petId,
        date,
        notes,
      });
    });
  });
});

// Medication Table
db.run(
  `CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name INTEGER NOT NULL,
    medicationName TEXT NOT NULL,
    dosage TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT,
    notes TEXT,
    FOREIGN KEY (name) REFERENCES pets(id)
  );`,
  (err) => {
    if (err) {
      console.error("Error creating medications table:", err.message);
    } else {
      console.log("Medications table created or already exists.");
    }
  }
);

// Medication Post
app.post("/api/medications", (req, res) => {
  const { petId, medicationName, dosage, startDate, endDate, notes } = req.body;

  // Basic validation
  if (!petId || !medicationName || !dosage || !startDate) {
    return res.status(400).json({ error: "Pet ID, medication name, dosage, and start date are required." });
  }

  // Check if petId exists in the pets table (optional)
  const petCheckQuery = `SELECT name FROM pets WHERE name = ?`;
  db.get(petCheckQuery, [petId], (err, pet) => {
    if (err) {
      return res.status(500).json({ error: "Error checking pet ID." });
    }

    if (!pet) {
      return res.status(404).json({ error: "Pet ID not found." });
    }

    // If pet exists, proceed to insert medication record
    const insertQuery = `
      INSERT INTO medications (name, medicationName, dosage, startDate, endDate, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(
      insertQuery,
      [petId, medicationName, dosage, startDate, endDate || null, notes || null],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Failed to add medication record." });
        }
        res.status(201).json({
          message: "Medication record added successfully.",
          medication_id: this.lastID,
          petId,
          medicationName,
          dosage,
          startDate,
          endDate,
          notes,
        });
      }
    );
  });
});

// Get All Medications or Filter by Pet ID
app.get("/api/medications", (req, res) => {
  const { petId } = req.query;

  let query = "SELECT * FROM medications";
  const params = [];

  // If petId is provided, add a WHERE clause
  if (petId) {
    query += " WHERE petId = ?";
    params.push(petId);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve medications." });
    }
    res.status(200).json(rows);
  });
});


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

app.get('/api/user', (req, res) => {
  const userId = 1; // Replace this with the actual user's ID, from session or JWT
  
  // Query the database for the user's name
  db.get('SELECT name FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (row) {
      // Send the user's name in the response
      res.json({ name: row.name });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
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
  db.all("SELECT * FROM users", [], (err, rows) => {
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
