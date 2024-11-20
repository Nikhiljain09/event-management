const events = require("./models/event");

// Create a new event (Only accessible by event organizers)
exports.createEvent = (req, res) => {
  const { title, description, date, time } = req.body;

  if (req.user.role !== "organizer") {
    return res
      .status(403)
      .json({ message: "Only organizers can create events" });
  }

  const newEvent = {
    id: events.length + 1,
    title,
    description,
    date,
    time,
    participants: [],
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
};

// Update an event (Only accessible by event organizers)
exports.updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, description, date, time } = req.body;

  if (req.user.role !== "organizer") {
    return res
      .status(403)
      .json({ message: "Only organizers can update events" });
  }

  const event = events.find((e) => e.id == id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  event.title = title || event.title;
  event.description = description || event.description;
  event.date = date || event.date;
  event.time = time || event.time;

  res.json(event);
};

// Delete an event (Only accessible by event organizers)
exports.deleteEvent = (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "organizer") {
    return res
      .status(403)
      .json({ message: "Only organizers can delete events" });
  }

  const eventIndex = events.findIndex((e) => e.id == id);
  if (eventIndex === -1)
    return res.status(404).json({ message: "Event not found" });

  events.splice(eventIndex, 1);
  res.status(204).send();
};

// Get all events
exports.getAllEvents = (req, res) => {
  res.json(events);
};

// Register for an event
exports.registerForEvent = (req, res) => {
  const { id } = req.params;

  const event = events.find((e) => e.id == id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.participants.includes(req.user.email)) {
    return res
      .status(400)
      .json({ message: "You are already registered for this event" });
  }

  // Add the participant
  event.participants.push(req.user.email);
  res.status(200).json({ message: "Successfully registered for the event" });
};
