import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import { configuration } from "./config.js";

// Load environment variables from .env file
import dotenv, { config } from "dotenv";
import { S3, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

dotenv.config();
const app = express();
app.use(express.json());
const stripe = new Stripe(process.env.STRIPE_SK);

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

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  try {
    const parallelUploads3 = new Upload({
      client: new S3({}) || new S3Client({}),
      params: {
        Bucket: configuration.Bucket,
        Key: configuration.Key,
        Body: file.buffer,
      },

      // optional tags
      tags: [
        /*...*/
      ],

      // additional optional fields show default values below:

      // (optional) concurrency configuration
      queueSize: 4,

      // (optional) size of each part, in bytes, at least 5MB
      partSize: 1024 * 1024 * 5,

      // (optional) when true, do not automatically call AbortMultipartUpload when
      // a multipart upload fails to complete. You should then manually handle
      // the leftover parts.
      leavePartsOnError: false,
    });

    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    await parallelUploads3.done();
    res.send("File uploaded successfully");
  } catch (e) {
    console.log(e);
    res.status(500).send("Error uploading file");
  }
});

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

app.post("/payment-sheet", async (req, res) => {
  try {
    const customer = await stripe.customers.create();

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-09-30.acacia" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "usd",
      customer: customer.id,
      // In production, you should collect this from your customer
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        "pk_live_51Q9GX8FDMnNxWG99uDKvCi1vntoMoomfk6eLD247QIv0xxyrIercSAdrZZTeqZmR3n6ZhloB5N6edXMLMsX9NJI600oXbzflFN",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
