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
    Blog.create(req.body.blog, function(err, blog) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.redirect('/blogs/' + blog.id);
    });
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
  
  
  //UPDATE ROUTE
  router.put("/:id", upload.single('image'), function(req, res){
    Blog.findById(req.params.id, async function(err, blog){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(blog.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  blog.imageId = result.public_id;
                  blog.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
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
  Blog.findById(req.params.id, async function(err, blog) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(blog.imageId);
        blog.remove();
        req.flash('success', 'Blog deleted successfully!');
        res.redirect('/blogs');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});
  
  

  
  
     module.exports = router;