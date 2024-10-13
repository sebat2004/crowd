import express from "express";
import mongoose from "mongoose";

// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

// Event schema and model
const eventSchema = new mongoose.Schema({
  name: String,
  event_date: Date,
  address: String,
  description: String,
  attendees: Number,
  capacity: Number,
  admission_cost: Number,
  location: pointSchema,
});

eventSchema.index({ location: "2dsphere" });

const Event = mongoose.model("Event", eventSchema);

// Express app setup
const app = express();
app.use(express.json());

// CRUD routes
app.get("/events", async (req, res) => {
  try {
    // Filter events by location
    if (req.query.latitude && req.query.longitude) {
      const latitude = parseFloat(req.query.latitude);
      const longitude = parseFloat(req.query.longitude);
      const maxDistance = parseInt(req.query.maxDistance) || 10000;

      const eventsNearby = await Event.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [latitude, longitude],
            },
            $maxDistance: maxDistance,
          },
        },
      });
      res.json(eventsNearby);
    } else {
      const allEvents = await Event.find();
      res.json(allEvents);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/events", async (req, res) => {
  const body = {
    ...req.body,
    event_date: new Date(req.body.event_date),
    location: {
      type: "Point",
      coordinates: req.body.coordinates,
    },
  };
  console.log(body);
  const event = new Event(body);
  try {
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/events/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/events/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 404 route
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
