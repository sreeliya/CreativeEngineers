// ---------------------------
//  Import Dependencies
// ---------------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// ---------------------------
//  Load Environment Variables
// ---------------------------
dotenv.config();

// Safety Check for .env Variables
if (!process.env.MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in .env file");
  process.exit(1);
}

// ---------------------------
//  Initialize Express App
// ---------------------------
const app = express();

// ---------------------------
//  Middleware
// ---------------------------
app.use(cors());
app.use(express.json());

// ---------------------------
//  MongoDB Connection
// ---------------------------
const connectDB = async () => {
  console.log("🔍 Connecting to MongoDB...");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("🔁 Retrying in 5 seconds...");
    setTimeout(connectDB, 5000); // retry every 5 seconds
  }
};
connectDB();

// ---------------------------
//  Default Route
// ---------------------------
app.get('/', (req, res) => {
  res.status(200).send('🌐 Server is running successfully!');
});

// ---------------------------
//  Contact Model
// ---------------------------
const mongooseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', mongooseSchema);

// ---------------------------
//  Contact Routes
// ---------------------------

// Save contact info
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ success: true, message: '📩 Contact saved successfully!' });
  } catch (err) {
    console.error('❌ Error saving contact:', err);
    res.status(500).json({ success: false, message: 'Failed to save contact.' });
  }
});

// Retrieve all contact info
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('❌ Error fetching contacts:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts.' });
  }
});

// ---------------------------
//  Error Handling Middleware
// ---------------------------
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server!",
  });
});

// ---------------------------
//  Start Server
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
