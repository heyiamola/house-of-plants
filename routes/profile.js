const express = require("express");

const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const User = require("../models/User.model");
const { BERLIN_BOROUGHS } = require("../utils/consts");

const parser = require("../config/cloudinary");

// add a route for if you go to /profile/, then you will get redirected to your own profile
router.get("/", isLoggedIn, (req, res) => {
  res.redirect(`${req.session.user.username}`);
});

router.get("/:username", isLoggedIn, (req, res) => {
  User.findOne({ username: req.params.username })
    .populate("usersPlants")
    .then((userProfile) => {
      let isAccountOwner;
      if (userProfile._id == req.session.user._id) {
        isAccountOwner = true;
      }
      res.render("profile/index", {
        userProfile,
        isAccountOwner,
        location: JSON.stringify(userProfile.location),
        containsMap: true,
      });
    });
});

router.get("/:username/edit", isLoggedIn, (req, res) => {
  console.log(req.session.user);
  if (req.params.username !== req.session.user.username) {
    return res.redirect("/");
  }
  res.render("profile/edit", {
    berlinBoroughs: BERLIN_BOROUGHS,
    containsMap: true,
  });
});

router.post("/edit", isLoggedIn, parser.single("user-image"), (req, res) => {
  const {
    name,
    shortBio,
    email,
    berlinBorough,
    latitude,
    longitude,
    profilePicture,
  } = req.body;
  User.findByIdAndUpdate(
    req.session.user._id, // id of the user that was logged in
    {
      name,
      shortBio,
      email,
      berlinBorough,
      location: { coordinates: [longitude, latitude] },
      profilePicture,
    },
    { new: true }
  ).then((updatedUser) => {
    console.log(profilePicture);
    req.session.user = updatedUser;
    res.redirect(`/profile/${updatedUser.username}`);
  });
});

module.exports = router;
