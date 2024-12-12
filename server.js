const express = require('express');
const mongoose = require('mongoose');
const { Form, Response } = require('./Form');
const cors = require('cors');
const bodyParser = require('body-parser');
const service = require('./service');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use environment variable for MongoDB URI
const MONGO_URI = process.env.MONGO_URI || `mongodb+srv://jainsam1975:YGI7VJotoS3eQ2ek@cluster0.mongodb.net/formbuilder?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/forms', async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/forms/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    res.json(form);
  } catch (err) {
    res.status(404).json({ error: 'Form not found' });
  }
});

app.post('/forms/:id/responses', async (req, res) => {
  try {
    const response = new Response({ formId: req.params.id, answers: req.body });
    await response.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port ' + (process.env.PORT || 3000));
});
