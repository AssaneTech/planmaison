//server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Routes
const userRoutes = require('./routes/route.user');
const planRoutes = require('./routes/route.plan');
const orderRoutes = require('./routes/route.order');

app.use('/users', userRoutes);
app.use('/plans', planRoutes);
app.use('/orders', orderRoutes);

