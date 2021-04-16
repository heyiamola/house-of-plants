// To do:
// - add seedling or full plant option
// - add spieces or plant API info? or botanical name?

const { Schema, model } = require("mongoose");

const {
  BERLIN_BOROUGHS,
  PLANT_GROWING_TEMPERATURE,
  PLANT_AVAILABILITY,
  PLANT_GIVEAWAY_EXCHANGE,
  PLANT_GROWING_LIGHT,
  PLANT_GROWING_LOCATION,
  PLANT_GROWING_WATER,
} = require("../utils/consts");

//const BERLIN_BOROUGHS = require("../utils/consts/berlin-boroughs.js");
//const PLANT_AVAILABILITY = require("../utils/consts/plant-availability.js");
//const PLANT_GIVEAWAY_EXCHANGE = require("../utils/consts/plant-giveaway-exchange");
//const PLANT_GROWING_LIGHT = require("../utils/consts/plant-growing-light");
//const PLANT_GROWING_LOCATION = require("../utils/consts/plant-growing-location");
//const PLANT_GROWING_TEMPERATURE = require("../utils/consts/plant-growing-temperature");
//const PLANT_GROWING_WATER = require("../utils/consts/plant-growing-water");

const plantSchema = new Schema({
  commonName: {
    type: String,
    required: true,
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
    required: true,
    maxLength: 1000,
    description: "A description of the plant",
  },
  availability: {
    type: String,
    required: true,
    default: "available",
    enum: PLANT_AVAILABILITY,
    description: "If the plant is available.",
  },
  giveawayOrExchange: {
    type: String,
    required: true,
    default: "giveaway",
    enum: PLANT_GIVEAWAY_EXCHANGE,
    description:
      "If the plant is for giveaway (free) or available for exchange with another plant.",
  },
  growingLight: {
    type: String,
    enum: PLANT_GROWING_LIGHT,
    required: true,
    deafult: "don't know",
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
    // required: true,
    deafult: "don't know",
    description: "The plants temperature requirement for growing.",
  },
  growingLocation: {
    type: String,
    enum: PLANT_GROWING_LOCATION,
    // required: true,
    deafult: "don't know",
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
    type: Number,
    description: "The height or length of the plant in centimeters.",
  },
  potDiameter: {
    type: Number,
    description: "The diameter of the plant pot in centimeters.",
  },
  date: { type: Date, required: true },
});

const Plant = model("Plant", plantSchema);

module.exports = Plant;
