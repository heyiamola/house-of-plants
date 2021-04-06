const { Schema, model } = require("mongoose");
const LOCATION_ENUM = require("../utils/consts");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    min: 3,
    max: 25,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    min: 1,
    max: 25,
  },
  location: {
    type: String,
    required: true,
    enum: LOCATION_ENUM,
  },
  image: {
    type: String,
    default: "",
  },
  bio: {},
  availablePlants: [],
  upcomingEvents: [],
});

const User = model("User", userSchema);

module.exports = User;
