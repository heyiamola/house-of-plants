const express = require("express");

const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const { BERLIN_BOROUGHS } = require("../utils/consts");

router.get("/plant", isLoggedIn, (req, res) => {
  res.render("search/plant", {
    berlinBoroughs: BERLIN_BOROUGHS,
    containsMap: true,
  });
});

module.exports = router;
