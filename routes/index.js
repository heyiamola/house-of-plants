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
        return foundPlants
          .filter((plant) => plant.berlinBorough === userLocation)
          .slice(0, 5);
      })
      .then((plantsInTheArea) => {
        isAnonymousUser = false;
        res.render("index", { userLocation, plantsInTheArea, isAnonymousUser });
      })
      .catch((err) => console.log(err));
  } else {
    Plant.find({})
      .then((foundPlants) => {
        return foundPlants.slice(0, 5);
      })
      .then((plantsInTheArea) => {
        isAnonymousUser = true;
        res.render("index", { plantsInTheArea, isAnonymousUser });
      })
      .catch((err) => console.log(err));
  }
});

router.get("/newsletter", isLoggedIn, (req, res) => {
  console.log(req.session.user);
  if (req.session.user.newsletter === true) {
    res.render("newsletter-true");
  } else {
    User.findByIdAndUpdate(req.session.user._id, { newsletter: true })
      .then((updatedUser) => {
        console.log(updatedUser);
        transporter.sendMail({
          from: '"House of Plants 🌱" <houseofplants.ih@gmail.com>',
          to: updatedUser.email,
          subject: "🙌 You're on the list 🙌",
          text: "Hello world?",
          html: newsletterMessage,
        });

        res.render("newsletter");
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
