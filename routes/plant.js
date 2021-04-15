const express = require("express");

const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const Plant = require("../models/Plant.model");
const User = require("../models/User.model");

const parser = require("../config/cloudinary");

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
    containsMap: true,
  });
});

router.post("/add", isLoggedIn, parser.single("plant-image"), (req, res) => {
  const {
    commonName,
    botanicalName,
    description,
    availability,
    giveawayOrExchange,
    growingLight,
    growingWater,
    growingTemperature,
    growingLocation,
    heightOrLength,
    potDiameter,
    growingNotes,
  } = req.body;
  console.log(req.body);
  Plant.create({
    commonName,
    botanicalName,
    owner: req.session.user._id,
    description,
    availability,
    giveawayOrExchange,
    growingLight,
    growingWater,
    growingTemperature,
    growingLocation,
    heightOrLength,
    potDiameter,
    growingNotes,
    date: new Date(),
  })
    .then((createdPlant) => {
      User.findByIdAndUpdate(
        req.session.user._id,
        {
          $push: { usersPlants: createdPlant._id },
        },
        { new: true }
      ).then(() => {
        console.log("new created plant");
        res.redirect(`view/${createdPlant._id}`);
      });
    })
    .then((createdPlant) => {})
    .catch((err) => {
      res.redirect("/", { errorMessage: err });
      console.log(err);
    });
});

router.get("/view/:plantId", isLoggedIn, (req, res) => {
  Plant.findById(req.params.plantId)
    .populate("owner")
    .then((foundPlant) => {
      let isPlantOwner;
      if (!foundPlant) {
        return res.redirect("/");
      }
      if ((foundPlant.owner._id = req.session.user._id)) {
        isPlantOwner = true;
      }
      console.log(foundPlant.owner);

      res.render("plant/view", {
        location: JSON.stringify(foundPlant.owner.location),
        foundPlant,
        isPlantOwner,
        containsMap: true,
      });
    })
    .catch((err) => console.log(err));
});

router.get("/:plantId/edit", isLoggedIn, (req, res) => {
  Plant.findById(req.params.plantId)
    .populate("owner")
    .then((foundPlant) => {
      if (!foundPlant) {
        return res.redirect("/");
      }
      res.render("plant/edit", {
        foundPlant,
        location: JSON.stringify(foundPlant.owner.location),
        berlinBoroughs: BERLIN_BOROUGHS,
        plantAvailability: PLANT_AVAILABILITY,
        plantGiveawayExchange: PLANT_GIVEAWAY_EXCHANGE,
        plantGrowingLight: PLANT_GROWING_LIGHT,
        plantGrowingLocation: PLANT_GROWING_LOCATION,
        plantGrowingTemperature: PLANT_GROWING_TEMPERATURE,
        plantGrowingWater: PLANT_GROWING_WATER,
        containsMap: true,
      });
    })
    .catch((err) => console.log(err));
});

router.post(
  "/:plantId/edit",
  isLoggedIn,
  parser.single("plant-image"),
  (req, res) => {
    const {
      commonName,
      botanicalName,
      description,
      availability,
      giveawayOrExchange,
      growingLight,
      growingWater,
      growingTemperature,
      growingLocation,
      heightOrLength,
      potDiameter,
      growingNotes,
      picture,
    } = req.body;
    Plant.findByIdAndUpdate(
      req.params.plantId,
      {
        commonName,
        botanicalName,
        description,
        availability,
        giveawayOrExchange,
        growingLight,
        growingWater,
        growingLocation,
        growingTemperature,
        heightOrLength,
        potDiameter,
        growingNotes,
        picture,
      },
      { new: true }
    )
      .then((updatedPlant) => {
        return res.redirect(`/plant/view/${updatedPlant._id}`);
      })
      .catch((err) => console.log(err));
  }
);

router.get("/:plantId/delete", isLoggedIn, (req, res) => {
  Plant.findById(req.params.plantId)
    .populate("owner")
    .then((foundPlant) => {
      if (!foundPlant) {
        return res.redirect("/");
      }
      if ((foundPlant.owner._id = req.session.user._id)) {
        console.log(foundPlant.owner.usersPlants);
        console.log(foundPlant._id);
        User.findByIdAndUpdate(
          foundPlant.owner._id,
          {
            $pull: { usersPlants: foundPlant._id },
          },
          { new: true }
        ).then(() => {
          console.log(foundPlant.owner.usersPlants);
          Plant.findByIdAndDelete(foundPlant._id).then(() => {
            return res.render("plant/delete", { foundPlant });
          });
        });
      }
    })
    .catch((err) => cosnole.log(err));
});

module.exports = router;
