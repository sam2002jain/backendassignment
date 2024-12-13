const express = require('express');
const router = express.Router();
const Form = require('./Form');

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

module.exports = router;
