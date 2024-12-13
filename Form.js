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
  questions: [
    {
      id: Number,
      type: String,
      text: String,
      options: [String],
      image: String,
    },
  ],
  headerImage: String,
});

const Form = mongoose.model('Form', formSchema);
