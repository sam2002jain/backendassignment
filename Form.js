const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: { type: String, required: true }, 
  label: { type: String, required: true },
  options: [String], 
  image: String, 
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  headerImage: String,  
  questions: [QuestionSchema],
});

const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
  answers: Map,  
});

const Form = mongoose.model('Form', FormSchema);
const Response = mongoose.model('Response', ResponseSchema);

module.exports = { Form, Response };