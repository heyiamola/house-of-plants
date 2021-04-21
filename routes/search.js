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
// const isLoggedIn = require("../middlewares/isLoggedIn");
const { listen } = require("../app");

router.get("/plant", (req, res) => {
  Plant.find({})
    .populate("owner")
    .then((foundPlants) => {
      let plantLocationResults = mapSearchResults(foundPlants);
      // console.log("user", req.session.user.location.coordinates);
      let userLocation;
      if (!req.session.user) {
        userLocation = "[13.3891, 52.5161]";
      } else {
        userLocation = JSON.stringify(req.session.user.location.coordinates);
      }
      console.log(userLocation);

      res.render("search/plant", {
        foundPlants,
        userLocation,
        plantLocations: JSON.stringify(plantLocationResults),
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

// router.post("/plant/filter", isLoggedIn, (req, res) => {
//   // let parsedJson;
//   // try {
//   //   parsedJson = JSON.parse(req.body); // Do your JSON handling here
//   // } catch (err) {
//   //   parsedJSON = "";
//   //   return res.render("/");
//   }

// console.log(parsedJson);
// });

router.post("/plant", (req, res) => {
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

  if (!req.session.user) {
    userLocation = "[13.3891, 52.5161]";
  } else {
    userLocation = JSON.stringify(req.session.user.location.coordinates);
  }
  console.log(userLocation);

  Plant.find(filter)
    .populate("owner")
    .then((foundPlants) => {
      let plantLocationResults = mapSearchResults(foundPlants);
      // console.log(foundPlants);
      res.render("search/plant", {
        foundPlants,
        userLocation,
        plantLocations: JSON.stringify(plantLocationResults),
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

function mapSearchResults(foundPlants) {
  let searchResultsArray;
  searchResultsArray = foundPlants
    .map(function (plant) {
      let plantOwner = plant.owner;
      let plantId = plant._id;
      let plantCommonName = plant.commonName;
      let plantPicture = plant.picture;

      return { plantOwner, plantId, plantCommonName, plantPicture };
    })
    .map(function (plant) {
      let plantLocation = plant.plantOwner.location.coordinates;
      let plantId = plant.plantId;
      let plantCommonName = plant.plantCommonName;
      let plantPicture = plant.plantPicture;
      return { plantLocation, plantId, plantCommonName, plantPicture };
    });
  return searchResultsArray;
}

module.exports = router;
