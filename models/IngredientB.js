const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientBSchema = new Schema({
  name: String,
  data: Array,
  description: String,
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  image: { type: String }
});

const IngredientB = mongoose.model("IngredientB", ingredientBSchema);

module.exports = IngredientB;
