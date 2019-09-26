const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientASchema = new Schema({
  name: String,
  data: Array,
  description: String,
  creator: {type: Schema.Types.ObjectId, ref: 'User'},
  image: {type: String},
});

const IngredientA = mongoose.model("IngredientA", ingredientASchema);

module.exports = IngredientA;