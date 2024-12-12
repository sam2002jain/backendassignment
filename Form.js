const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const formSchema = new mongoose.Schema({
  questions: Array,
  headerImage: String,
});

const Form = mongoose.model('Form', formSchema);
