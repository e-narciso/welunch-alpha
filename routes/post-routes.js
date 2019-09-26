const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require('../config/cloudinary-settings.js');

router.get("/posts", (req, res, next) => {
  Post.find()
    .then(allThePosts => {
      if (req.user) {
        allThePosts.forEach(eachPost => {
          if (req.user._id.equals(eachPost.creator) || req.user.isAdmin){
            eachPost.mine = true;
          }
        });
      }
      res.render("post-views/index", { posts: allThePosts });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/posts/details/:id", (req, res, next) => {
  let id = req.params.id;
  Post.findById(id)
    .then(postObject => {
      Comment.find({
        post: id
      })
        .then(result => {
          console.log(result);
          res.render("post-views/show", {
            post: postObject,
            comments: result
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

router.get("/posts/add-new", (req, res, next) => {
  if(!req.user){
    req.flash('error', "Please login to make a post")
    res.redirect('/login');
}
  res.render("post-views/new");
});

router.post("/posts/creation", uploadCloud.single("theImage"), (req, res, next) => {
  let body = req.body.theContent;
  let image = req.file.url;

  Post.create({
    body: body,
    image: image
  })
    .then(result => {
      res.redirect("/posts/details/" + result._id);
    })
    .catch(err => {
      next(err);
    });
});

router.post("/posts/delete/:id", (req, res, next) => {

  let id = req.params.id;
  Post.findByIdAndRemove(id)
    .then(result => {
      res.redirect("/posts");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/posts/edit/:id", (req, res, next) => {

  let id = req.params.id;
  Post.findById(id)
    .then(thePost => {
      res.render("posts-views/edit", { post: thePost });
    })
    .catch(err => {
      next(err);
    });
});

router.post("/posts/update/:id", uploadCloud.single("theImage"), (req, res, next) => {
  let id = req.params.id;
  Post.findByIdAndUpdate(id, {
    body: req.body.theContent,
    image: req.file.url,
  })
    .then(result => {
      res.redirect("/posts/details/" + id);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
