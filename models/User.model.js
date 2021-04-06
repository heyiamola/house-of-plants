const { Schema, model } = require("mongoose");
const BERLIN_BOROUGHS = require("../utils/consts/berlin-boroughs.js");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 1000,
    minLength: 4,
    description: "The username for the user",
  },
  password: { type: String, required: true, maxLength: 5000 },
  name: {
    type: String,
    maxLength: 1000,
    description: "The users name, however they want to specify",
  },
  shortBio: {
    type: String,
    maxLength: 2000,
    description: "An optional short bio for the user.",
  },
  email: {
    type: String,
    required: true,
    maxLength: 2000,
    description: "The users email.",
  },
  berlinBorough: {
    type: String,
    default: "Mitte",
    enum: BERLIN_BOROUGHS,
    description: "The users borough in Berlin.",
  },
  profilePicture: {
    type: String,
    default: "/images/default-profile-picture.png",
  },
  plants: [{ type: Schema.Types.ObjectId, ref: "Plant" }],
});

const User = model("User", userSchema);

module.exports = User;
