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
      console.log(userProfile);
      res.render("profile/index", {
        userProfile,
        isAccountOwner,
        location: JSON.stringify(userProfile.location),
        containsMap: true,
      });
    });
});

router.get("/:username/edit", isLoggedIn, (req, res) => {
  if (req.params.username !== req.session.user.username) {
    return res.redirect("/");
  }
  User.findOne({ username: req.params.username })
    .then((foundUser) => {
      console.log(foundUser);
      res.render("profile/edit", {
        berlinBoroughs: BERLIN_BOROUGHS,
        containsMap: true,
        foundUser,
      });
    })
    .catch((err) => console.log(err));
});

router.post("/edit", isLoggedIn, parser.single("user-image"), (req, res) => {
  console.log(req.body);
  const {
    name,
    shortBio,
    email,
    berlinBorough,
    latitude,
    longitude,
  } = req.body;
  console.log(req.file);
  const location = { coordinates: [longitude, latitude] };
  const body = Object.fromEntries(
    Object.entries(req.body).filter((el) => {
      return el[1];
    })
  );
  if (req.file) {
    body.profilePicture = req.file.path;
  }
  User.findByIdAndUpdate(
    req.session.user._id, // id of the user that was logged in
    {
      ...body,
      location,
    },
    { new: true }
  ).then((updatedUser) => {
    console.log(updatedUser);
    req.session.user = updatedUser;
    res.redirect(`/profile/${updatedUser.username}`);
  });
});

router.get("/:username/delete", isLoggedIn, (req, res) => {
  User.findOne({ username: req.params.username })
    .then((foundUser) => {
      if (!foundUser) {
        return res.redirect("/");
      }
      if (req.session.user._id != foundUser._id) {
        return res.redirect("/");
      }
      return res.render("profile/delete", { foundUser });
    })
    .catch((err) => console.log(err));
});

router.get("/:username/delete/confirmed", isLoggedIn, (req, res) => {
  User.findOneAndDelete({ username: req.params.username })
    .then((foundUser) => {
      if (!foundUser) {
        return res.redirect("/");
      }
      if (req.session.user._id != foundUser._id) {
        return res.redirect("/");
      }
      req.session.destroy();
      return res.render("profile/delete-confirm");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
