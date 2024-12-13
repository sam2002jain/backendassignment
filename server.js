const express = require('express'); // Correctly import express
const app = express(); // Initialize the Express app
const router = express.Router();
const Form = require('./Form'); // Ensure you have the Form model
const port = process.env.PORT || 4000;

// Middleware to parse JSON
app.use(express.json());

// Router endpoint
router.post('/forms', async (req, res) => {
  try {
    const { questions, headerImage } = req.body;

    // Validate and save form to the database
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
  console.log(`Example app listening on port ${port}`); // Use template literals
});

module.exports = router;
