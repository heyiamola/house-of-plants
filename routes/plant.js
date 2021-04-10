const express = require("express");

const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const Plant = require("../models/Plant.model");

const BERLIN_BOROUGHS = require("../utils/consts/berlin-boroughs.js");
const PLANT_AVAILABILITY = require("../utils/consts/plant-availability.js");
const PLANT_GIVEAWAY_EXCHANGE = require("../utils/consts/plant-giveaway-exchange");
const PLANT_GROWING_LIGHT = require("../utils/consts/plant-growing-light");
const PLANT_GROWING_LOCATION = require("../utils/consts/plant-growing-location");
const PLANT_GROWING_TEMPERATURE = require("../utils/consts/plant-growing-temperature");
const PLANT_GROWING_WATER = require("../utils/consts/plant-growing-water");

router.get("/add", isLoggedIn, (req, res) => {
  res.render("plant/add", {
    berlinBoroughs: BERLIN_BOROUGHS,
    plantAvailability: PLANT_AVAILABILITY,
    plantGiveawayExchange: PLANT_GIVEAWAY_EXCHANGE,
    plantGrowingLight: PLANT_GROWING_LIGHT,
    plantGrowingLocation: PLANT_GROWING_LOCATION,
    plantGrowingTemperature: PLANT_GROWING_TEMPERATURE,
    plantGrowingWater: PLANT_GROWING_WATER,
  });
});

router.post("/add", isLoggedIn, (req, res) => {
  const {
    commonName,
    botanicalName,
    description,
    availability,
    giveawayOrExchange,
    location,
    growingLight,
    growingWater,
    growingTemperature,
    growingLocation,
    heightOrLength,
    potDiameter,
    growingNotes,
  } = req.body;
  // console.log(req.body);
  Plant.create({
    commonName,
    botanicalName,
    owner: req.session.user._id,
    description,
    availability,
    giveawayOrExchange,
    berlinBorough: location,
    growingLight,
    growingWater,
    growingTemperature,
    growingLocation,
    heightOrLength,
    potDiameter,
    growingNotes,
    date: new Date(),
  })
    .then((createdPlant) => res.redirect(`view/${createdPlant._id}`))
    .catch((err) => console.log(err));
});

router.get("/view/:plantId", isLoggedIn, (req, res) => {
  Plant.findById(req.params.plantId)
    .populate("owner")
    .then((foundPlant) => {
      let isPlantOwner;
      // console.log("owner");
      // console.log(foundPlant);
      if (!foundPlant) {
        return res.redirect("/");
      }
      res.render("plant/view", { foundPlant });
      console.log(foundPlant.owner);
      console.log(req.session.user._id);
      if (foundPlant.owner === req.session.user._id) {
        isPlantOwner = true;
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
