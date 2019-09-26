const express = require("express");
const router = express.Router();
const User = require("../models/User");
const IngredientA = require("../models/IngredientA");
const Meal = require("../models/Meal");
const uploadCloud = require("../config/cloudinary-settings.js");

router.get("/ingredients-a", (req, res, next) => {
  IngredientA.find()
    .then(allTheIngredients => {
      if (req.user) {
        allTheIngredients.forEach(eachIngredient => {
          if (req.user._id.equals(eachIngredient.creator) || req.user.isAdmin) {
            eachIngredient.mine = true;
          }
        });
      }
      Meal.find().then(allTheMeals => {
        // allTheMeals.forEach(meal => {

        // })
        res.render("ingredient-a-views/index", {
          ingredientsA: allTheIngredients,
          meals: allTheMeals,
        });
      });
      // res.send({ ingredientsA: allTheIngredients })
    })
    .catch(err => {
      next(err);
    });
});

// router.get("/ingredients-a/details/:id", (req, res, next) => {
//   let id = req.params.id;
//   IngredientA.findById(id)
//     .then(ingredientObject => {
//       Meal.find({
//         first: id
//       })
//         .then(result => {
//           console.log(result);
//           res.render("ingredients-a-views/show", {
//             ingredient: ingredientObject,
//             filteredMeals: result
//           });
//         })
//         .catch(err => {
//           next(err);
//         });
//     })
//     .catch(err => {
//       next(err);
//     });
// });

router.get("/ingredients-a/add-new", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "Please login to add a new ingredient");
    res.redirect("/login");
  }
  res.render("ingredient-a-views/new");
});

router.post(
  "/ingredients-a/creation",
  uploadCloud.single("theImage"),
  (req, res, next) => {
    let ingredientObj = {};

    ingredientObj.name = req.body.theName;
    ingredientObj.data = req.body.theData;
    ingredientObj.description = req.body.theDescription;
    if (req.file) {
      ingredientObj.image = req.file.url;
    }
    IngredientA.create(ingredientObj)
      .then(result => {
        res.redirect("/ingredients-a/");
      })
      .catch(err => {
        next(err);
      });
  }
);

router.post("/ingredients-a/delete/:id", (req, res, next) => {
  let id = req.params.id;
  IngredientA.findByIdAndRemove(id)
    .then(result => {
      res.redirect("/ingredients-a");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/ingredients-a/edit/:id", (req, res, next) => {
  let id = req.params.id;
  IngredientA.findById(id)
    .then(theIngredient => {
      res.render("ingredient-a-views/edit", { ingredient: theIngredient });
    })
    .catch(err => {
      next(err);
    });
});

router.post(
  "/ingredients-a/update/:id",
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

    IngredientA.findByIdAndUpdate(id, ingredientObj)
      .then(result => {
        res.redirect("/ingredients-a/");
      })
      .catch(err => {
        next(err);
      });
  }
);

module.exports = router;
