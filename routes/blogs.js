var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");
var middleware =require("../middleware");


// INDEX ROUTE
router.get("/",  middleware.isLoggedIn, function(req, res){
    Blog.find({}, function(err, blogs){
      if (err)
      {
        console.log(err);
      }
      else{
        res.render("blog/index",{blogs: blogs,currentUser:req.user });
      }
    });
  
  });
  
  //NEW ROUTE
  router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("blog/new");
  });
  
  // CREATE ROUTE
  router.post("/", middleware.isLoggedIn, function(req,res){
  
    //sanitize the input to avoid js code from user input
   // req.body.blog.body = req.sanitize(req.body.blog.body);

   var name = req.body.title;
    var image = req.body.image;
    var desc = req.body.body;
    var author = {
      id: req.user._id,
      username: req.user.username
  }
    var newCampground = {title: name, image: image, body: desc, author:author}
    console.log(author);
    // create blog
  Blog.create(newCampground, function(err, newBlog){
    if(err){
      res.render("blog/new");
    }
    else{
      console.log( newBlog);
      res.redirect("/blogs");
    }
  });
  });
  
  
  // SHOW ROUTE 
  router.get("/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
      if(err){
  
        res.redirect("/blogs");
      }
      else
      {
        res.render("blog/show",{ blog: foundBlog});
      }
    })
  });
  
  //EDIT ROUTE 
  router.get("/:id/edit",  middleware.checkBlog, function(req,res){
    //check if user logged In
  
      Blog.findById(req.params.id, function(err, foundBlog) {
        
          res.render("blog/edit",{ blog: foundBlog});
          
          
      });
   
    
      
   
  })
  
  
  
  //UPDATED ROUTE 
  router.put("/:id", middleware.checkBlog, function(req,res){
  
    //sanitize the input to avoid js code from user input
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
      if(err)
      {
        res.redirect("/blogs");
      }
      else{
        res.redirect("/blogs/" + req.params.id);
      }
    });
  });
  
  
  //DELETE ROUTE
  router.delete("/:id", middleware.checkBlog, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.redirect("/blogs");
      }
      else{
        res.redirect("/blogs");
      }
    })
  
  });
  //middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
  
  

  
  
     module.exports = router;