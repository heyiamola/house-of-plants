const { Schema, model } = require("mongoose");
const BERLIN_BOROUGHS = require("../utils/consts/berlin-boroughs.js");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 25,
    minLength: 2,
    description: "The username for the user",
  },
  password: { type: String, required: true },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 25,
    description: "The users name, however they want to specify",
  },
  shortBio: {
    type: String,
    maxLength: 2000,
    description: "An optional short bio for the user.",
  },
  email: {
    type: String,
    unique: true,
    required: true,
    maxLength: 100,
    description: "The users email.",
  },
  berlinBorough: {
    type: String,
    required: true,
    default: "Mitte",
    enum: BERLIN_BOROUGHS,
    description: "The users borough in Berlin.",
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  profilePicture: {
    type: String,
    default: "/images/default-profile-picture.png",
  },
  usersPlants: [{ type: Schema.Types.ObjectId, ref: "Plant" }],
  upcomingEvents: [],
  createdEvents: [],
});

const User = model("User", userSchema);

module.exports = User;
