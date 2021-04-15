const express = require("express");

const {
  BERLIN_BOROUGHS,
  PLANT_GROWING_TEMPERATURE,
  PLANT_AVAILABILITY,
  PLANT_GIVEAWAY_EXCHANGE,
  PLANT_GROWING_LIGHT,
  PLANT_GROWING_LOCATION,
  PLANT_GROWING_WATER,
} = require("../utils/consts");
const Plant = require("../models/Plant.model");

const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const { listen } = require("../app");

router.get("/plant", isLoggedIn, (req, res) => {
  Plant.find({}).then((foundPlants) => {
    res.render("search/plant", {
      foundPlants,
      berlinBoroughs: BERLIN_BOROUGHS,
      plantAvailability: PLANT_AVAILABILITY,
      plantGiveawayExchange: PLANT_GIVEAWAY_EXCHANGE,
      plantGrowingLight: PLANT_GROWING_LIGHT,
      plantGrowingLocation: PLANT_GROWING_LOCATION,
      plantGrowingTemperature: PLANT_GROWING_TEMPERATURE,
      plantGrowingWater: PLANT_GROWING_WATER,
      containsMap: true,
    });
  });
});

router.post("/plant", isLoggedIn, (req, res) => {
  const { name: searchName, location: searchLocation } = req.body;
  let filter;
  let locationFilter;
  let nameFilter;
  if (searchLocation === "all") {
    locationFilter = {};
  } else {
    locationFilter = { berlinBorough: `${searchLocation}` };
  }
  if (!searchName) {
    nameFilter = {};
  } else {
    nameFilter = {
      $or: [
        { commonName: { $regex: searchName } },
        { botanicalName: { $regex: searchName } },
      ],
    };
  }

  filter = { $and: [nameFilter, locationFilter] };
  console.log(filter);

  Plant.find(filter).then((foundPlants) => {
    res.render("search/plant", {
      foundPlants,
      berlinBoroughs: BERLIN_BOROUGHS,
      plantAvailability: PLANT_AVAILABILITY,
      plantGiveawayExchange: PLANT_GIVEAWAY_EXCHANGE,
      plantGrowingLight: PLANT_GROWING_LIGHT,
      plantGrowingLocation: PLANT_GROWING_LOCATION,
      plantGrowingTemperature: PLANT_GROWING_TEMPERATURE,
      plantGrowingWater: PLANT_GROWING_WATER,
      containsMap: true,
    });
  });
});

module.exports = router;
