const express = require("express");
const router = express.Router();
const User = require("../models/User");
const IngredientB = require("../models/IngredientB");
const Meal = require("../models/Meal");
const uploadCloud = require("../config/cloudinary-settings.js");

router.get("/ingredients-b", (req, res, next) => {
  IngredientB.find()
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
        console.log(allTheIngredients);
        res.render("ingredient-b-views/index", {
          ingredientsB: allTheIngredients,
          meals: allTheMeals
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
      res.redirect("/ingredients-b");
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
