const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealSchema = new Schema({
  first: { type: Schema.Types.ObjectId, ref: "IngredientA" },
  second: { type: Schema.Types.ObjectId, ref: "IngredientB" },
  name: { type: String },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  body: { type: String },
  image: { type: String }
});

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
