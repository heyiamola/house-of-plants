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
  });
});

router.post("/add", isLoggedIn, parser.single("plant-image"), (req, res) => {
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
      res.render("plant/view", { foundPlant, isPlantOwner });
    })
    .catch((err) => console.log(err));
});

router.get("/:plantId/edit", isLoggedIn, (req, res) => {
  Plant.findById(req.params.plantId)
    .then((foundPlant) => {
      if (!foundPlant) {
        return res.redirect("/");
      }
      res.render("plant/edit", {
        foundPlant,
        berlinBoroughs: BERLIN_BOROUGHS,
        plantAvailability: PLANT_AVAILABILITY,
        plantGiveawayExchange: PLANT_GIVEAWAY_EXCHANGE,
        plantGrowingLight: PLANT_GROWING_LIGHT,
        plantGrowingLocation: PLANT_GROWING_LOCATION,
        plantGrowingTemperature: PLANT_GROWING_TEMPERATURE,
        plantGrowingWater: PLANT_GROWING_WATER,
      });
    })
    .catch((err) => console.log(err));
});

//FILIPE
router.post("/:plantId/edit", isLoggedIn, (req, res) => {
  console.log(req.body);
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

  // console.log(req.session);
  // Plant.findByIdAndUpdate(
  //   req.session.plant._id,
  //   {
  //     commonName,
  //     botanicalName,
  //     description,
  //     availability,
  //     giveawayOrExchange,
  //     location: berlinBorough,
  //     growingLight,
  //     growingWater,
  //     growingLocation,
  //     growingTemperature,
  //     heightOrLength,
  //     potDiameter,
  //     growingNotes,
  //   },
  //   { new: true }
  // ).then((updatedPlant) => {
  //   req.session.plant = updatedPlant;
  //   res.redirect(`/view/${updatedPlant._id}`);
  // });
});

// router.get("/:plantId/delete", isLoggedIn, (req, res) => {
//   Plant.findById(req.params.plantId)
//     .populate("owner")
//     .then((foundPlant) => {
//       if (!foundPlant) {
//         return res.redirect("/");
//       }
//       if ((foundPlant.owner._id = req.session.user._id)) {
//         Plant.findByIdAndDelete(foundPlant._id).then(() => {
//           User.findByIdAndDelete(foundPlant.owner._id, {
//             $pull: { userPlants: foundPlant._id },
//           });
//         });
//         res.render("plant/delete", { foundPlant });
//       }
//     })
//     .catch((err) => cosnole.log(err));
// });

module.exports = router;
