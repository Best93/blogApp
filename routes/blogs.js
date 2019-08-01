var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");
var middleware =require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

//cloudinary config
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

// INDEX ROUTE
router.get("/",  function(req, res){
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
  
  //CREATE - add new blog to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
  cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
    if(err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    // add cloudinary url for the image to the blog object under image property
    req.body.blog.image = result.secure_url;
    // add image's public_id to blog object
    req.body.blog.imageId = result.public_id;
    // add author to blog
    req.body.blog.author = {
      id: req.user._id,
      username: req.user.username
    }
    //create blog with image
    Blog.create(req.body.blog, function(err, blog) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.redirect('/blogs' );
    });
  });
});
  
  
  // SHOW ROUTE 
  router.get("/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments likes").exec(function(err, foundBlog){
      if(err){
  
        res.redirect("/blogs");
      }
      else
      {
        res.render("blog/show",{ blog: foundBlog});
      }
    })
  });
  
  // Campground Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
  // look the blog by using their db id
  Blog.findById(req.params.id, function (err, foundBlog) {
      if (err) {
          console.log(err);
          return res.redirect("/blogs");
      }

      // check if req.user._id exists in foundCampground.likes
      var foundUserLike = foundBlog.likes.some(function (like) {
          return like.equals(req.user._id);
      });

      if (foundUserLike) {
          // user already liked, removing like
          foundBlog.likes.pull(req.user._id);
      } else {
          // adding the new user like
          foundBlog.likes.push(req.user);
      }

      foundBlog.save(function (err) {
          if (err) {
              console.log(err);
              return res.redirect("/blogs");
          }
          return res.redirect("/blogs/" + foundBlog._id);
      });
  });
});

  //EDIT ROUTE 
  router.get("/:id/edit",  middleware.checkBlog, function(req,res){
    //check if user logged In
  
      Blog.findById(req.params.id, function(err, foundBlog) {
        
          res.render("blog/edit",{ blog: foundBlog});
          
          
      });
   
    
      
   
  })
  
  
  //UPDATE ROUTE
  router.put("/:id", upload.single('image'), function(req, res){
    Blog.findById(req.params.id, async function(err, blog){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        // destroy image on cloud first before uploaded the new
         else {
            if (req.file) {
              try {   // destroy image on cloud first before uploaded the new
                  await cloudinary.v2.uploader.destroy(blog.imageId);
                  //get the new image
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  blog.imageId = result.public_id;
                  blog.image = result.secure_url;
              } catch(err) {
                //show error if any and return user back to the prev page
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            //update blog with the new input and save to db
            blog.name = req.body.blog.name;
            blog.description = req.body.blog.description;
            blog.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/blogs/" + blog._id);
        }
    });
});

  
  //DELETE ROUTE
router.delete('/:id', function(req, res) {
  //find the desired blog
  Blog.findById(req.params.id, async function(err, blog) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
      //delete image from cloud and from db
        await cloudinary.v2.uploader.destroy(blog.imageId);
        blog.remove();
        req.flash('success', 'Blog deleted successfully!');
        res.redirect('/blogs');
    }
    //catch error if any display it to users
     catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});
  
  

  
  
     module.exports = router;