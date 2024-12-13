const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/mydb`, {
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
})();
const formSchema = new mongoose.Schema({
  questions: Array,
  headerImage: String,
});

const Form = mongoose.model('Form', formSchema);
