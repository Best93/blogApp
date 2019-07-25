var Comment = require("../models/comments");
var Blog = require("../models/blogs");

// all middleware goes here
var middlewareObj = {};

// define middleware
middlewareObj.checkBlog = function(req, res, next) {
  //check if user is logged in
  if (req.isAuthenticated()) {
    // look for comment and the menu
    Blog.findById(req.params.id, function(err, foundBlog) {
      if (err || !foundBlog) {
        req.flash("error", "Menu not found");
        //deny access
        res.redirect("back");
      } else {
        //does user own the comment
        if (foundBlog.author.id.equals(req.user._id)) {
          next();
        }
        // deny access
        else {
          req.flash("error", "You do not have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

// check if users own the comment
middlewareObj.checkCommentOwnership = function(req, res, next) {
  //chek if users logged in
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "Comment not found");
        res.redirect("/seeMenu");
      } else {
        //does user own the comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

//middleware
middlewareObj.isLoggedIn = function(req, res, next) {
  // check if users logged in then allow transaction
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj;
