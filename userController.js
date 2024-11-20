const users = require("../../models/user");
const events = require("../../models/event");

// View the authenticated user's profile
exports.viewUserProfile = (req, res) => {
  const userEmail = req.user.email; // Email is stored in JWT payload
  const user = users.find((u) => u.email === userEmail);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    username: user.username,
    email: user.email,
    role: user.role,
  });
};

// Update the authenticated user's profile (username, email, etc.)
exports.updateUserProfile = (req, res) => {
  const { username, email, password } = req.body;
  const userEmail = req.user.email; // Email is stored in JWT payload
  const user = users.find((u) => u.email === userEmail);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user fields
  if (username) user.username = username;
  if (email) user.email = email; // Update email if provided
  if (password) {
    // Hash the new password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err)
        return res.status(500).json({ message: "Error hashing password" });
      user.password = hashedPassword;
    });
  }

  res.json({ message: "User profile updated successfully", user });
};

// Get all events the user is registered for (based on user email)
exports.viewUserEvents = (req, res) => {
  const userEmail = req.user.email; // Email from JWT payload
  const userEvents = events.filter((event) =>
    event.participants.includes(userEmail)
  );

  if (userEvents.length === 0) {
    return res.status(404).json({ message: "No events found for this user" });
  }

  res.json(userEvents);
};
