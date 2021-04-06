// To do:
// - add seedling or full plant option
// - add which inputs are strictly required
// - review all default params
// - change measurements (hight, length, pot diameter) into numerics (not strings)
// - add spieces or plant API info?

const { Schema, model } = require("mongoose");

const BERLIN_BOROUGHS = require("../utils/consts/berlin-boroughs.js");
const PLANT_AVAILABILITY = require("../utils/consts/plant-availability.js");
const PLANT_GIVEAWAY_EXCHANGE = require("../utils/consts/plant-giveaway-exchange");
const PLANT_GROWING_LIGHT = require("../utils/consts/plant-growing-light");
const PLANT_GROWING_LOCATION = require("../utils/consts/plant-growing-location");
const PLANT_GROWING_TEMPERATURE = require("../utils/consts/plant-growing-temperature");
const PLANT_GROWING_WATER = require("../utils/consts/plant-growing-water");

const plantSchema = new Schema({
  commonName: {
    type: String,
    maxLength: 1000,
    description: "The name the plant is commonly known for.",
  },
  botanicalName: {
    type: String,
    maxLength: 1000,
    description: "The official botanical name.",
  },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  description: {
    type: String,
    maxLength: 1000,
    description: "A description of the plant",
  },
  availability: {
    type: String,
    default: "available",
    enum: PLANT_AVAILABILITY,
    description: "If the plant is available.",
  },
  giveawayOrExchange: {
    type: String,
    default: "giveaway",
    enum: PLANT_GIVEAWAY_EXCHANGE,
    description:
      "If the plant is for giveaway (free) or available for exchange with another plant.",
  },
  berlinBorough: {
    type: String,
    default: "Mitte",
    enum: BERLIN_BOROUGHS,
    description: "The plants location / borough in Berlin.",
  },
  growingLight: {
    type: String,
    enum: PLANT_GROWING_LIGHT,
    description: "The plants light requirement for growing.",
  },
  growingWater: {
    type: String,
    enum: PLANT_GROWING_WATER,
    description: "The plants water requirement for growing.",
  },
  growingTemperature: {
    type: String,
    enum: PLANT_GROWING_TEMPERATURE,
    description: "The plants temperature requirement for growing.",
  },
  growingLocation: {
    type: String,
    enum: PLANT_GROWING_LOCATION,
    description:
      "The plants location requirement for growing (inside / outside).",
  },
  growingNotes: {
    type: String,
    maxLength: 1000,
    description: "A free place for notes on the growing requirements.",
  },
  picture: {
    type: String,
    default: "/images/default-plant-picture.png",
  },
  heightOrLength: {
    type: String,
    description: "The height or length of the plant in centimeters.",
  },
  potDiameter: {
    type: String,
    description: "The diameter of the plant pot in centimeters.",
  },
});

const Plant = model("Plant", plantSchema);

module.exports = Plant;
