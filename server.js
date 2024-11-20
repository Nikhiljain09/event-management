const express = require("express");
const bodyParser = require("body-parser");
const authController = require("./authController");
const eventController = require("./eventController");
const userController = require("./userController");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// User registration and login routes
app.post("/register", authController.registerUser);
app.post("/login", authController.loginUser);

// User profile management (authentication required)
app.use(authController.verifyToken); // Middleware to verify JWT token
app.get("/profile", userController.viewUserProfile); // View user profile
app.put("/profile", userController.updateUserProfile); // Update user profile
app.get("/user-events", userController.viewUserEvents); // Get events user is registered for

// Event management routes (authentication required)
app.post("/events", eventController.createEvent);
app.put("/events/:id", eventController.updateEvent);
app.delete("/events/:id", eventController.deleteEvent);
app.get("/events", eventController.getAllEvents);
app.post("/events/:id/register", eventController.registerForEvent);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
