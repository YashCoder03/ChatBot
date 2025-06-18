const express = require('express');
const cors = require('cors');
const path = require('path');
const chatRoutes = require('./routes/chat.routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', chatRoutes);

// Fallback route
app.get('/', (req, res) => {
  res.send('🤖 Chatbot Backend is running!');
});

module.exports = app;
