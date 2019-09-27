const express = require("express");
const router = express.Router();
const User = require("../models/User");
const IngredientB = require("../models/IngredientB");
const Meal = require("../models/Meal");
const uploadCloud = require("../config/cloudinary-settings.js");
const multer = require("multer");

router.get("/ingredients-b", (req, res, next) => {
  Meal.find()
    .then(allTheMeals => {
      IngredientB.find().then(allTheIngredients => {
        if (req.user) {
          allTheIngredients.forEach(eachIngredient => {
            if (
              req.user._id.equals(eachIngredient.creator) ||
              req.user.isAdmin
            ) {
              eachIngredient.mine = true;
            }
          });
        }
        allTheIngredients.forEach(eachIngredient => {
          eachIngredient.mealsCreated = [];
          allTheMeals.forEach((eachMeal, i) => {
            if (eachMeal.second.equals(eachIngredient._id)) {
              eachIngredient.mealsCreated.push(eachMeal);
            }
          });
        });
        res.render("ingredient-b-views/index", {
          ingredientsB: allTheIngredients,
          meals: allTheMeals
        });
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/ingredients-b/add-new", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "Please login to add a new ingredient");
    res.redirect("/login");
  }
  res.render("ingredient-b-views/new");
});

router.post(
  "/ingredients-b/creation",
  uploadCloud.single("theImage"),
  (req, res, next) => {
    let ingredientObj = {};

    ingredientObj.name = req.body.theName;
    ingredientObj.data = req.body.theData;
    ingredientObj.description = req.body.theDescription;
    ingredientObj.creator = req.user._id;
    if (req.file) {
      ingredientObj.image = req.file.url;
    }
    IngredientB.create(ingredientObj)
      .then(result => {
        res.redirect("/ingredients-b/");
      })
      .catch(err => {
        next(err);
      });
  }
);

router.post("/ingredients-b/delete/:id", (req, res, next) => {
  let id = req.params.id;
  IngredientB.findByIdAndRemove(id)
    .then(result => {
      Meal.deleteMany({ second: { $in: id } }).then(data => {
        console.log(data)
        res.redirect("/ingredients-b");
      })
      .catch(err => {
        next(err);
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/ingredients-b/edit/:id", (req, res, next) => {
  let id = req.params.id;
  IngredientB.findById(id)
    .then(theIngredient => {
      res.render("ingredient-b-views/edit", { ingredient: theIngredient });
    })
    .catch(err => {
      next(err);
    });
});

router.post(
  "/ingredients-b/update/:id",
  uploadCloud.single("theImage"),
  (req, res, next) => {
    let id = req.params.id;

    let ingredientObj = {};

    ingredientObj.name = req.body.theName;
    ingredientObj.data = req.body.theData;
    ingredientObj.description = req.body.theDescription;
    if (req.file) {
      ingredientObj.image = req.file.url;
    }

    IngredientB.findByIdAndUpdate(id, ingredientObj)
      .then(result => {
        res.redirect("/ingredients-b/");
      })
      .catch(err => {
        next(err);
      });
  }
);

module.exports = router;
