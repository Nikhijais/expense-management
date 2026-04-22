const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Student Auth API is running!' });
});

// ENV
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 🔥 FIX: Server always start hoga (DB fail ho ya na ho)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

// 🔥 MongoDB connect (separate)
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB error:', err));