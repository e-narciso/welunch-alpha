const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const uploadCloud = require('../config/cloudinary-settings.js');

router.get("/signup", (req, res, next) => {
  res.render("user-views/signup");
});

router.post("/signup", (req, res, next) => {
  let adminPrivilege = false;

  if (req.user) {
    // check if someone is logged in
    if (req.user.isAdmin) {
      adminPrivilege = req.body.role ? req.body.role : false;
    }
  }

  const username = req.body.theUsername;
  const password = req.body.thePassword;
  // const isAdmin = req.body.role;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  User.create({
    username: username,
    password: hash,
    isAdmin: adminPrivilege,
  })
    .then(() => {
      res.redirect("/login");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("user-views/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.post("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});


router.get("/account", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "Please login to your account");
    res.redirect("/login");
  }
  res.render("user-views/settings");
});

router.post("/account/google-update", (req, res, next) => {
    User.findByIdAndUpdate(req.user.id, {
      username: req.body.theUsername
    })
      .then(data => {
        req.flash("success", "Your settings have been saved");
        res.redirect("/account");
      })
      .catch(err => next(err));
  }
)

router.post("/account/update", uploadCloud.single("theImage"), (req, res, next) => {

  let id = req.user.id;
  let oldPass = req.body.theOldPassword;
  let newPass = req.body.theNewPassword;

  if (!bcrypt.compareSync(oldPass, req.user.password)) {
    req.flash("error", "Passwords do not match");
    res.redirect("/account");
  }

  const salt = bcrypt.genSaltSync(10);
  let hash;
  if (newPass) {
    hash = new Promise((resolve, reject) => {
      resolve(bcrypt.hashSync(newPass, salt));
    });
  } else {
    hash = new Promise((resolve, reject) => {
      resolve(bcrypt.hashSync(oldPass, salt));
    });
  }

  hash
    .then(theActualPassword => {

      let userObj = {};
      userObj.username = req.body.theUsername;
      userObj.password = theActualPassword;
      if(req.file){
        userObj.profileImage = req.file.url;
      }
      User.findByIdAndUpdate(id, userObj)
        .then(result => {
          req.flash("success", "Your settings have been saved");
          res.redirect("/account");
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(err);
    });
});

router.post("/account/delete-my-account", (req, res, next) => {
  User.findByIdAndRemove(req.user.id)
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  })
);

module.exports = router;
