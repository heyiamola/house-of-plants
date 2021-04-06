const { Schema, model } = require("mongoose");
const BERLIN_BOROUGHS = require("../utils/consts/berlin-boroughs.js");

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 150,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    enum: BERLIN_BOROUGHS,
  },
  venue: {
    type: String,
    required: true,
    maxLength: 250,
  },
  description: {
    type: String,
    required: true,
    minLength: 100,
  },
  image: {
    type: String,
    default: "",
  },
  organizer: { type: Schema.Types.ObjectId, ref: "User" },
  maxAttendees: { type: Number, required: true },
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  fee: {
    type: String,
    required: true,
  },
  slug: { type: String, required: true, unique: true },
});

const Event = model("Event", eventSchema);

module.exports = Event;
