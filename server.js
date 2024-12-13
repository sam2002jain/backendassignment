const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Form = require('./Form');

dotenv.config();

const app = express();
const router = express.Router();
const port = process.env.PORT || 4000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/mydb`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
})();

// API route
router.post('/forms', async (req, res) => {
  try {
    const { questions, headerImage } = req.body;

    if (!questions || questions.length === 0 || !headerImage) {
      return res.status(400).json({ message: 'Invalid form data' });
    }

    // Validate and save form
    const form = new Form({ questions, headerImage });
    await form.save();

    res.status(201).json({ message: 'Form saved successfully', form });
  } catch (error) {
    res.status(400).json({ message: 'Error saving form', error });
  }
});

// Use the router
app.use('/api', router);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
