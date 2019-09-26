const express = require("express");
const router = express.Router();
const IngredientA = require("../models/IngredientA");
const IngredientB = require("../models/IngredientB");
const Meal = require("../models/Meal");
const uploadCloud = require("../config/cloudinary-settings.js");

router.get("/meals", (req, res, next) => {
  Meal.find()
    .then(allTheMeals => {
      if (req.user) {
        allTheMeals.forEach(eachMeal => {
          if (req.user._id.equals(eachMeal.creator) || req.user.isAdmin) {
            eachMeal.mine = true;
          }
        });
      }
        res.render("ingredient-a-views/index", {
          meals: allTheMeals,
        });
      // res.send({ ingredientsA: allTheIngredients })
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;