const express = require("express");
const router = express.Router();
const IngredientA = require("../models/IngredientA");
const IngredientB = require("../models/IngredientB");
const Meal = require("../models/Meal");
const uploadCloud = require("../config/cloudinary-settings.js");
const multer = require("multer");

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
      console.log(allTheMeals);
      res.render("meal-views/index", {
        meals: allTheMeals
      });
      // res.send({ ingredientsA: allTheIngredients })
    })
    .catch(err => {
      next(err);
    });
});

router.post("/create-random-meal", (req, res, next) => {
  IngredientA.find()
    .then(allA => {
      IngredientB.find()
        .then(allB => {
          let randA = ~~(Math.random() * allA.length);
          let randB = ~~(Math.random() * allB.length);

          let pickedA = allA[randA];
          let pickedB = allB[randB];

          let randNameA = ~~(Math.random() * pickedA.data.length);
          let randNameB = ~~(Math.random() * pickedB.data.length);

          let pickedAData = pickedA.data[randNameA];
          let pickedBData = pickedB.data[randNameB];

          let name = pickedAData + " " + pickedBData;
          console.log(
            "+++++++++++==+++++++",
            randA,
            randB,
            pickedA,
            pickedB,
            randNameA,
            randNameB,
            pickedAData,
            pickedBData
          );
          Meal.create({
            first: pickedA,
            second: pickedB,
            name: name,
            creator: req.user.id
          })
            .then(meal => {
              res.redirect("/profile");
            })
            .catch(err => {
              next(err);
            });
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
