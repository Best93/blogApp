var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware =require("../middleware");

//home route
router.get("/",function(req, res){
    res.render("landing");
    });
    
    
    
    
    //  ===========
    // AUTH ROUTES
    //  ===========
    
    // show register form
    router.get("/register", function(req, res){
      res.render("register"); 
    });
    
    // sign up logic
    router.post("/register", function(req, res) {
      var newUser = new User({ username: req.body.username });
      User.register(newUser, req.body.password, function(err, user) {
        if (err) {
          req.flash("error", err.message);
          return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
          req.flash("success", "Welcome to Blog App " + user.username);
          res.redirect("/blogs");
        });
      });
    });
    
    
    
    //show login form
    router.get("/login", function(req, res) {
      res.render("login");
    });
    
    
    //handling login logic
    router.post(
      "/login",
      passport.authenticate("local", {
        successRedirect: "/blogs",
        successFlash: "Welcome Back",
        failureRedirect: "/login",
        failureFlash: true
      }),
      function(req, res) {}
    );
    
    
    //logic  route
    router.get("/logout", function(req, res) {
      req.logout();
      
      res.redirect("/");
    });


    //middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
  
    module.exports = router;