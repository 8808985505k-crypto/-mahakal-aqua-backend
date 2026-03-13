const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://krpsjfjf_db_user:QpaCZ3NfU684IZAf@cluster0.lquiyjo.mongodb.net/mahakal_aqua?appName=Cluster0&retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB error:', err.message));

// Booking Schema
const bookingSchema = new mongoose.Schema({
  Name: String,
  Phone: String,
  Email: String,
  Address: String,
  Area: String,
  ServiceType: String,
  Date: String,
  Time: String,
  Issue: String,
  Type: { type: String, default: 'Booking' },
  Status: { type: String, default: 'Pending' },
  CreatedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// API Routes

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ CreatedAt: -1 }).limit(100);
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Add new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { Name, Phone, Email, Address, Area, ServiceType, Date, Time, Issue, Type } = req.body;
    
    const newBooking = new Booking({
      Name,
      Phone,
      Email: Email || '',
      Address: Address || '',
      Area: Area || '',
      ServiceType: ServiceType || '',
      Date: Date || '',
      Time: Time || '',
      Issue: Issue || '',
      Type: Type || 'Booking',
      Status: 'Pending'
    });
    
    await newBooking.save();
    res.json({ success: true, data: newBooking });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Update booking status
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { Status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { Status }, { new: true });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
