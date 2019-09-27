const express = require("express");
const router = express.Router();
const IngredientA = require("../models/IngredientA");
const IngredientB = require("../models/IngredientB");
const Meal = require("../models/Meal");
const uploadCloud = require("../config/cloudinary-settings.js");
const multer = require("multer");

router.get("/meals", (req, res, next) => {
  Meal.find()
    .populate("first")
    .populate("second")
    .then(allTheMeals => {
      if (req.user) {
        allTheMeals.forEach(eachMeal => {
          if (req.user._id.equals(eachMeal.creator) || req.user.isAdmin) {
            eachMeal.mine = true;
          }
        });
      }
      // console.log(allTheMeals);
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

router.get("/meals/details/:id", (req, res, next) => {
  let id = req.params.id;
  Meal.findById(id)
    .populate("first")
    .populate("second")
    .then(thisMeal => {
      if (req.user) {
        if (req.user._id.equals(thisMeal.creator) || req.user.isAdmin) {
          thisMeal.mine = true;
        }
      }
      console.log(thisMeal.body);
      res.render("meal-views/show", { meal: thisMeal });
    })
    .catch(err => {
      next(err);
    });
});

router.post("/meals/delete/:id", (req, res, next) => {
  let id = req.params.id;
  Meal.findByIdAndRemove(id)
    .then(result => {
      res.redirect("/meals");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/meals/edit/:id", (req, res, next) => {
  let id = req.params.id;
  Meal.findById(id)
    .then(theMeal => {
      console.log(theMeal);
      res.render("meal-views/edit", { meal: theMeal });
    })
    .catch(err => {
      next(err);
    });
});

router.post(
  "/meals/update/:id",
  uploadCloud.single("theImage"),
  (req, res, next) => {
    let id = req.params.id;

    let mealObj = {};

    mealObj.body = req.body.theBody;
    if (req.file) {
      mealObj.image = req.file.url;
    }

    Meal.findByIdAndUpdate(id, mealObj)
      .then(result => {
        res.redirect("/meals/");
      })
      .catch(err => {
        next(err);
      });
  }
);

module.exports = router;
