var express = require("express");
var router = express.Router();
var passport = require("passport");
var Blog = require("../models/blogs");
var User = require("../models/user");
var middleware =require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
// cloudinary config
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'di2kty7ll', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
    router.post("/register", upload.single('avatar'), function(req, res) {
      cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        // add cloudinary url for the image to the blog object under image property
    req.body.avatar = result.secure_url;
      var newUser = new User({
        username:req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar : req.body.avatar
      });
      //register the new user to db
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

    //user profile
    router.get("/users/:id", function(req,res){
      //find user to display 
      User.findById(req.params.id, function(err, foundUser){
        if(err)
        {
          req.flash("error","Something went wrong.");
          res.redirect("/blogs");
        }
        //find blog that relate to the current user
        Blog.find().where("author.id").equals(foundUser.id).exec(function(err, blogs){
        {
          if(err)
          {
            req.flash("error","Something went wrong.");
            res.redirect("/blogs");
          }

        }
        //render user page
        res.render("users/show", {user:foundUser, blogs:blogs});
      });
      });
    });


 
  
    module.exports = router;