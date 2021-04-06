const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  // let user;
  // if (req.session.user) {
  //   user = req.session.user;
  // }
  res.render("index");
});

module.exports = router;
