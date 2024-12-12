const express = require('express');
const mongoose = require('mongoose');
const { Form, Response } = require('./Form');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
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

app.listen(3000, () => console.log('Server running on port 3000'));
