const express = require("express");

const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const User = require("../models/User.model");
const { BERLIN_BOROUGHS } = require("../utils/consts");

router.get("/:username/edit", isLoggedIn, (req, res) => {
  if (req.params.username !== req.session.user.username) {
    return res.redirect("/");
  }
  res.render("profile/edit", {
    berlinBoroughs: BERLIN_BOROUGHS,
    containsMap: true,
  });
});

router.get("/:username", isLoggedIn, (req, res) => {
  User.findOne({ username: req.params.username }).then((userProfile) => {
    res.render("profile/index", {
      userProfile,
      location: JSON.stringify(userProfile.location),
      containsMap: true,
    });
  });
});

router.post("/edit", isLoggedIn, (req, res) => {
  const { name, shortBio, email, location, latitude, longitude } = req.body;

  User.findByIdAndUpdate(
    req.session.user._id, // id of the user that was logged in
    {
      name,
      shortBio,
      email,
      berlinBorough: location,
      location: { coordinates: [longitude, latitude] },
    },
    { new: true }
  ).then((updatedUser) => {
    req.session.user = updatedUser;
    res.redirect(`/profile/${updatedUser.username}`);
  });
});

module.exports = router;
