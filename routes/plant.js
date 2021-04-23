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

const { transporter, plantInquiry } = require("../utils/mail");

// Defaults

const optionPreselected = require("../utils/optionPreselected");
const shouldNotBeLoggedIn = require("../middlewares/shouldNotBeLoggedIn");
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
  const body = Object.fromEntries(
    Object.entries(req.body).filter((el) => {
      return el[1];
    })
  );

  if (req.file) {
    body.picture = req.file.path;
  }

  Plant.create({
    ...body,
    owner: req.session.user._id,
    date: new Date(),
    berlinBorough: req.session.user.berlinBorough,
  })
    .then((createdPlant) => {
      console.log(createdPlant);
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
      // console.log(foundPlant.owner._id);
      // console.log(req.session.user._id);
      let isPlantOwner;
      if (!foundPlant) {
        return res.redirect("/");
      }
      if (foundPlant.owner._id == req.session.user._id) {
        isPlantOwner = true;
      }
      // console.log(isPlantOwner);
      const dateTimeFormatted = foundPlant.date.toDateString();
      const dataAvailable = {
        growingLight: !(foundPlant.growingLight === "don't know"),
        growingWater: !(foundPlant.growingWater === "don't know"),
        growingTemperature: !(foundPlant.growingTemperature === "don't know"),
        growingLocation: !(foundPlant.growingLocation === "don't know"),
      };
      //Calculate URL for icons:
      let foundPlantLightIcon = false;
      if (foundPlant.growingLight === "direct sun") {
        foundPlantLightIcon = "/images/icons/i_direct_sun.svg";
      }
      if (foundPlant.growingLight === "half shade") {
        foundPlantLightIcon = "/images/icons/i_half_shade.svg";
      }
      if (foundPlant.growingLight === "full shade") {
        foundPlantLightIcon = "/images/icons/i_full_shade.svg";
      }
      let foundPlantWaterIcon = false;
      if (foundPlant.growingWater === "regular") {
        foundPlantWaterIcon = "/images/icons/i_water_regular.svg";
      }
      if (foundPlant.growingWater === "average") {
        foundPlantWaterIcon = "/images/icons/i_water_average.svg";
      }
      if (foundPlant.growingWater === "low") {
        foundPlantWaterIcon = "/images/icons/i_water_low.svg";
      }
      let foundPlantTemperatureIcon = false;
      if (foundPlant.growingTemperature === "hot") {
        foundPlantTemperatureIcon = "/images/icons/i_temperature_hot.svg";
      }
      if (foundPlant.growingTemperature === "average") {
        foundPlantTemperatureIcon = "/images/icons/i_temperature_average.svg";
      }
      if (foundPlant.growingTemperature === "cold") {
        foundPlantTemperatureIcon = "/images/icons/i_temperature_cold.svg";
      }
      let foundPlantLocationIcon = false;
      if (foundPlant.growingLocation === "inside") {
        foundPlantLocationIcon = "/images/icons/i_location_inside.svg";
      }
      if (foundPlant.growingLocation === "outside during summer") {
        foundPlantLocationIcon = "/images/icons/i_location_outside_summer.svg";
      }
      if (foundPlant.growingLocation === "outside") {
        foundPlantLocationIcon = "/images/icons/i_location_outside.svg";
      }
      // console.log(dataAvailable.growingLight);
      res.render("plant/view", {
        location: JSON.stringify(foundPlant.owner.location),
        foundPlant,
        dateTimeFormatted,
        isPlantOwner,
        containsMap: true,
        dataAvailable,
        foundPlantLightIcon,
        foundPlantWaterIcon,
        foundPlantTemperatureIcon,
        foundPlantLocationIcon,
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

    const body = Object.fromEntries(
      Object.entries(req.body).filter((el) => {
        return el[1];
      })
    );
    if (req.file) {
      body.picture = req.file.path;
    }

    Plant.findByIdAndUpdate(
      req.params.plantId,
      {
        ...body,
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
      if (foundPlant.owner._id != req.session.user._id) {
        return res.redirect("/");
      }
      return res.render("plant/delete", { foundPlant });
    })
    .catch((err) => console.log(err));
});

router.get("/:plantId/delete/confirmed", isLoggedIn, (req, res) => {
  Plant.findById(req.params.plantId)
    .then((foundPlant) => {
      if (!foundPlant) {
        return res.redirect("/");
      }
      if (foundPlant.owner.toString() != req.session.user._id.toString()) {
        return res.redirect("/");
      }
      Plant.findByIdAndDelete(foundPlant._id).then(() => {
        User.findByIdAndUpdate(req.session.user._id, {
          $pull: { usersPlants: req.params.plantId },
        }).then(() => res.render("plant/delete-confirm"));
      });
    })
    .catch();
});

router.get("/:plantId/contact", isLoggedIn, (req, res) => {
  Plant.findById(req.params.plantId)
    .populate("owner")
    .then((foundPlant) => {
      if (!foundPlant) {
        return res.redirect("/");
      }

      transporter.sendMail({
        from: req.session.user.email,
        to: foundPlant.owner.email,
        subject: "🌱 You've got mail! 🌱",
        text: "Hello world?",
        html: plantInquiry,
      });
      console.log(foundPlant);
      return res.render("plant/plant-inquiry", { foundPlant });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
