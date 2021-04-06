const { Schema, model } = require("mongoose");

const plantSchema = new Schema({
  commonName: {},
  botanicalName: {},
  image: {},
  owner: {},
  description: {},
  availability: {},
  swappingMethod: {},


});

const Plant = model("Plant", plantSchema);

module.exports = Plant;
