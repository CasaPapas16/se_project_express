const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: [2, "name must be at least 2 characters"],
    maxlength: [30, "name must be at most 30 characters"],
  },
  weather: {
    type: String,
    required: [true, "weather is required"],
  },
  imageURL: {
    type: String,
    required: [true, "imageUrl is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

module.exports = mongoose.model("clothingItem", clothingItem);
