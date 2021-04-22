const router = require("express").Router();

const isLoggedIn = require("../middlewares/isLoggedIn");

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
const Event = require("../models/Event.model");
const User = require("../models/User.model");

const { transporter, newsletterMessage } = require("../utils/mail");

router.get("/", (req, res, next) => {
  // let user;
  // if (req.session.user) {
  //   user = req.session.user;
  // }

  let userLocation;
  let isAnonymousUser;

  if (req.session.user) {
    userLocation = req.session.user.berlinBorough;
    Plant.find({})
      .populate("owner")
      .then((foundPlants) => {
        console.log(foundPlants);
        return foundPlants
          .filter((plant) => plant.owner.berlinBorough === userLocation)
          .slice(1, 6);
      })
      .then((plantsInTheArea) => {
        isAnonymousUser = false;
        res.render("index", { userLocation, plantsInTheArea, isAnonymousUser });
      })
      .catch((err) => console.log(err));
  } else {
    Plant.find({})
      .then((foundPlants) => {
        return foundPlants.slice(1, 6);
      })
      .then((plantsInTheArea) => {
        isAnonymousUser = true;
        res.render("index", { plantsInTheArea, isAnonymousUser });
      })
      .catch((err) => console.log(err));
  }
});

router.get("/newsletter", isLoggedIn, (req, res) => {
  User.findOneAndUpdate(
    req.session.user._id,
    { newsletter: true },
    { new: true }
  )
    .then((updatedUser) => {
      transporter.sendMail({
        from: '"House of Plants 🌱" <houseofplants.ih@gmail.com>',
        to: "houseofplants.ih@gmail.com",
        subject: "🪴 Welcome to House of Plants 🪴",
        text: "Hello world?",
        html: newsletterMessage,
      });

      res.render("newsletter");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
