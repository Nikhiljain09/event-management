const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("./models/user");

// Secret key for JWT
const JWT_SECRET = "your_jwt_secret";

// User Registration
exports.registerUser = async (req, res) => {
  const { username, password, email, role } = req.body;

  // Check if user already exists
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = { username, password: hashedPassword, email, role };
  users.push(newUser);

  // Send email (simulated for now)
  console.log(`Email sent to ${email}`);

  // Respond with success
  res.status(201).json({ message: "User registered successfully" });
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Create JWT token
  const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
};

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};
