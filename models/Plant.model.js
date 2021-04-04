const { Schema, model } = require("mongoose");

const plantSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 1000,
    minLength: 4,
    description: "The username for the user",
  },
});

const Plant = model("Plant", plantSchema);

module.exports = Plant;
