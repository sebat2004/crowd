import express from "express";
import { expressjwt } from 'express-jwt'
import jwks from 'jwks-rsa';
import mongoose from "mongoose";
import Stripe from "stripe";
import sgMail from "@sendgrid/mail";
import QRCode from "qrcode";

import { configuration } from "./config.js";
import multer from "multer";
const upload = multer();

// Load environment variables from .env file
import dotenv from "dotenv";
import { S3, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

dotenv.config();
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const stripe = new Stripe(process.env.STRIPE_SK);

const imageSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  data: {type: Buffer, required: true},
  contentType: {type: String, required: true},
});

const Image = mongoose.model('Image', imageSchema);

sgMail.setApiKey(process.env.SENDGRID_KEY);
const MONGODB_URI = process.env.MONGODB_URI;

const jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-jr03u2n4ktx2p1ud.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://dev-jr03u2n4ktx2p1ud.us.auth0.com/api/v2/',
  issuer: 'https://dev-jr03u2n4ktx2p1ud.us.auth0.com/',
  algorithms: ['RS256']
});

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
  imageURL: String,
  location: pointSchema,
});

const ticketSchema = new mongoose.Schema({
  ticketId: String,
  valid: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

eventSchema.index({ location: "2dsphere" });

const Event = mongoose.model("Event", eventSchema);

// Express app setup
const endpointSecret = "";

app.post("/images", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const parallelUploads3 = new Upload({
      client: new S3Client({}),
      params: {
        Bucket: configuration.Bucket,
        Key: `${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    });

    await parallelUploads3.done();

    const imageUrl = `https://${configuration.Bucket}.s3.amazonaws.com/${parallelUploads3.params.Key}`;
    res.status(200).json({ imageName: imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

app.get('/images/:name', async (req, res) => {
  const {imagename} = req.params;
  const image = await Image.findOne({name});
  if (!image) {
    return res.status(404).json({success: false, message: 'Image not found.'});
  }
  res.set('Content-Type', image.contentType);
  res.send(image.data);
});

const createFormData = (uri) => {
  const fileName = uri.split('/').pop();
  const fileType = fileName.split('.').pop();
  const formData = new FormData();
  formData.append('image', {
    name: fileName,
    uri,
    type: `image/${fileType}`,
  });
  return formData;
};

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event = req.body;

    if (endpointSecret) {
      const signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
        await new Ticket({ ticketId: paymentIntent.id }).save();
        const qr = await QRCode.toBuffer(paymentIntent.id);
        const msg = {
          to: "TODO",
          from: "noreply@pdx9280.com",
          subject: "Your ticket has arrived",
          text: "Thank you for your purchase. Your QR code ticket is attached.",
          html: `<img src="cid:qrcode" alt="Ticket QR Code" />`,
          attachments: [
            {
              content: qr.toString("base64"),
              filename: "qrcode.png",
              type: "image/png",
              content_id: "qrcode",
            },
          ],
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("email sent");
          })
          .catch((err) => {
            console.error(err);
          });
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
    res.send();
  }
);

app.use('/payment-sheets', jwtCheck);
app.use('/verify-ticket', jwtCheck);
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
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
          },
        },
      });
      console.log(eventsNearby);
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
  try {
    const {
      name,
      event_date,
      address,
      description,
      capacity,
      coordinates,
      cost,
      imageUrl,
    } = req.body;

    const event = new Event({
      name,
      event_date: new Date(event_date),
      address,
      description,
      capacity,
      location: {
        type: "Point",
        coordinates,
      },
      admission_cost: cost,
      imageURL: imageUrl,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
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

app.post("/payment-sheet", async (req, res) => {
  try {
    const { cost } = req.body
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-09-30.acacia" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(cost),
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
        "pk_test_51Q9GX8FDMnNxWG99BVAFvcTLzqEvl2UCpifsG8rWvQvORmuWb8UAZOY6t1qep9AWxs6XFYyzUOxuYkZsATYcLMr900WqWdpAwe",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/verify-ticket", async (req, res) => {
  try {
    const { ticketId } = req.body;
    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      return res.join({ success: false, message: "No ticket" });
    }

    if (!ticket.valid) {
      return res.json({ success: false, message: "Invalid ticket" });
    }

    ticket.valid = false;
    await ticket.save();

    res.json({ success: true, message: "Ticket verified and consumed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
