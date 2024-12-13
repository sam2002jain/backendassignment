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
  questions: {
    type: [
      {
        id: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          required: true,
          enum: ['Text', 'Grid', 'CheckBox'], // Ensure valid question types
        },
        text: {
          type: String,
          required: true, // Make sure every question has text
        },
        options: {
          type: [String],
          default: [], // Default to an empty array if no options are provided
        },
        image: {
          type: String,
          default: null, // Default to null if no image is provided
        },
      },
    ],
    required: true,
  },
  headerImage: {
    type: String,
    required: true, // Ensure the form always has a header image
  },
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;



