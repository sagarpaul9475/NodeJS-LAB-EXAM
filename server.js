const express = require("express");
const app = express();

const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Custom Middleware (Logging)
app.use((req, res, next) => {
  const currentTime = new Date().toLocaleString();
  console.log(`Request received at: ${currentTime}`);
  console.log(`${req.method} ${req.url}`);
  next();
});

// In-memory users array
let users = [];

// Helper function for response
const response = (message) => {
  return {
    message,
    time: new Date().toLocaleString(),
  };
};

//
// 1. ROOT ROUTE
//
app.get("/", (req, res) => {
  res.json(response("Server Running"));
});

//
// 2. USER ROUTES
//

// GET all users
app.get("/users", (req, res) => {
  res.json({
    ...response("Users fetched successfully"),
    data: users,
  });
});

// GET user by ID (BONUS)
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users[id];

  if (!user) {
    return res.json(response("User not found"));
  }

  res.json({
    ...response("User fetched successfully"),
    data: user,
  });
});

// POST add user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return res.json(response("Name and email are required"));
  }

  // Check duplicate email
  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.json(response("Email already exists"));
  }

  users.push({ name, email });

  res.json(response("User added successfully"));
});

// DELETE user by ID
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (!users[id]) {
    return res.json(response("User not found"));
  }

  users.splice(id, 1);

  res.json(response("User deleted successfully"));
});

//
// 3. LOGIN ROUTE
//
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check missing fields
  if (!email || !password) {
    return res.json(response("All fields required"));
  }

  // Hardcoded credentials
  if (email === "admin@gmail.com" && password === "1234") {
    return res.json(response("Login Success"));
  } else {
    return res.json(response("Invalid Credentials"));
  }
});

//
// 4. START SERVER
//
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});