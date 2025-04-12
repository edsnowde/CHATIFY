// index.js
// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware: Enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);


// Import auth routes and mount them under /api/auth
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a test route
app.get('/', (req, res) => {
  res.send('Welcome to the StudExchanger Backend!');
});

// Start the server on the specified port from .env or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
