const { Schema, model } = require("mongoose");
const LOCATION_ENUM = require("../utils/consts");

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 10,
    max: 150,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    enum: LOCATION_ENUM,
  },
  venue: {
    type: String,
    required: true,
    max: 250,
  },
  description: {
    type: String,
    required: true,
    min: 100,
  },
  image: {
    type: String,
    default: "",
  },
  organizer: { type: Schema.Types.ObjectId, ref: "User" },
  maxAttendees: { type: Number },
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  fee: {
    type: String,
    required: true,
  },
});

const Event = model("Event", eventSchema);

module.exports = Event;
