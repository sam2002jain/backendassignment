const express = require('express');
const Form = require('./Form'); 
const app = express();

app.use(express.json());

app.post('/forms', async (req, res) => {
  try {
    const { questions, headerImage } = req.body;
    const newForm = new Form({ questions, headerImage });
    await newForm.save();
    res.status(201).send(newForm);
  } catch (error) {
    res.status(500).send(error);
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
