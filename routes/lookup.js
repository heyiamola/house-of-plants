const { Router } = require("express");
const router = Router();
const axios = require("axios");

const TREFLE_IO_ACCESS_TOKEN = process.env.TREFLE_IO_ACCESS_TOKEN;

const TREFLE_URL_SEARCH = `https://trefle.io/api/v1/plants/search?token=${TREFLE_IO_ACCESS_TOKEN}`;

router.get("/", (req, res) => {
  res.render("lookup/trefle");
});

router.post("/", (req, res) => {
  let searchedPlant = req.body.commonName;
  axios
    .get(TREFLE_URL_SEARCH + "&q=" + searchedPlant)
    .then((trefleResponse) => {
      console.log("r:", trefleResponse.data);
      res.render("lookup/trefle", { returnedPlant: trefleResponse.data.data });
    })
    .catch((err) => {
      console.log("err:", err.message);
    });
});

module.exports = router;
