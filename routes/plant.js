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

// Defaults

const optionPreselected = require("../utils/optionPreselected");
const PLANT_GIVEAWAY_EXCHANGE_DEFAULT = "giveaway";
const PLANT_GROWING_LIGHT_DEFAULT = "don't know";
const PLANT_GROWING_LOCATION_DEFAULT = "don't know";
const PLANT_GROWING_TEMPERATURE_DEFAULT = "don't know";
const PLANT_GROWING_WATER_DEFAULT = "don't know";

router.get("/add", isLoggedIn, (req, res) => {
  res.render("plant/add", {
    berlinBoroughs: BERLIN_BOROUGHS,
    plantGiveawayExchange: optionPreselected(
      PLANT_GIVEAWAY_EXCHANGE,
      PLANT_GIVEAWAY_EXCHANGE_DEFAULT
    ),
    plantGrowingLight: optionPreselected(
      PLANT_GROWING_LIGHT,
      PLANT_GROWING_LIGHT_DEFAULT
    ),
    plantGrowingLocation: optionPreselected(
      PLANT_GROWING_LOCATION,
      PLANT_GROWING_LOCATION_DEFAULT
    ),
    plantGrowingTemperature: optionPreselected(
      PLANT_GROWING_TEMPERATURE,
      PLANT_GROWING_TEMPERATURE_DEFAULT
    ),
    plantGrowingWater: optionPreselected(
      PLANT_GROWING_WATER,
      PLANT_GROWING_WATER_DEFAULT
    ),
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

  if (!commonName || !description) {
    return res.status(400).render("plant/add", {
      errorMessage: "Please fill in all required fields.",
      berlinBoroughs: BERLIN_BOROUGHS,
      containsMap: true,
      plantGiveawayExchange: optionPreselected(
        PLANT_GIVEAWAY_EXCHANGE,
        giveawayOrExchange
      ),
      plantGrowingLight: optionPreselected(PLANT_GROWING_LIGHT, growingLight),
      plantGrowingLocation: optionPreselected(
        PLANT_GROWING_LOCATION,
        growingLocation
      ),
      plantGrowingTemperature: optionPreselected(
        PLANT_GROWING_TEMPERATURE,
        growingTemperature
      ),
      plantGrowingWater: optionPreselected(PLANT_GROWING_WATER, growingWater),
    });
  }
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
      const dateTimeFormatted = foundPlant.date.toDateString();
      const dataAvailable = {
        growingLight: !(foundPlant.growingLight === "don't know"),
        growingWater: !(foundPlant.growingWater === "don't know"),
        growingTemperature: !(foundPlant.growingTemperature === "don't know"),
        growingLocation: !(foundPlant.growingLocation === "don't know"),
      };
      console.log(dataAvailable.growingLight);
      res.render("plant/view", {
        location: JSON.stringify(foundPlant.owner.location),
        foundPlant,
        dateTimeFormatted,
        isPlantOwner,
        containsMap: true,
        dataAvailable,
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
        plantAvailability: optionPreselected(
          PLANT_AVAILABILITY,
          foundPlant.availability
        ),
        plantGiveawayExchange: optionPreselected(
          PLANT_GIVEAWAY_EXCHANGE,
          foundPlant.giveawayOrExchange
        ),
        plantGrowingLight: optionPreselected(
          PLANT_GROWING_LIGHT,
          foundPlant.growingLight
        ),
        plantGrowingLocation: optionPreselected(
          PLANT_GROWING_LOCATION,
          foundPlant.growingLocation
        ),
        plantGrowingTemperature: optionPreselected(
          PLANT_GROWING_TEMPERATURE,
          foundPlant.growingTemperature
        ),
        plantGrowingWater: optionPreselected(
          PLANT_GROWING_WATER,
          foundPlant.growingWater
        ),
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
    // check if a new picture was added, if not, make it the default picture.
    let updatedPicture;
    if (!picture) {
      updatedPicture = "/images/default-plant-picture.png";
    } else {
      updatedPicture = picture;
    }
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
        picture: updatedPicture,
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
