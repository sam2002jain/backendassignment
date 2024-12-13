const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Form = require('./Form'); // Ensure the Form model is correctly imported

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware to parse JSON
app.use(express.json());

// Router setup
const router = express.Router();

router.post('/forms', async (req, res) => {
  try {
    const { questions, headerImage } = req.body;

    // Validate the payload against the schema
    const form = new Form({ questions, headerImage });
    await form.save();

    res.status(201).json({ message: 'Form saved successfully', form });
  } catch (error) {
    res.status(400).json({ message: 'Error saving form', error });
  }
});

// Use the router
app.use('/api', router);

// Connect to MongoDB and start the server
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
})();
