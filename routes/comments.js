var express = require("express");
var router = express.Router({ mergeParams: true });
var Blog = require("../models/blogs");
var Comment = require("../models/comments");
var middleware = require("../middleware");


// ====================
// COMMENTS ROUTES
// ====================

// Comments new

router.get("/new", middleware.isLoggedIn , function(req, res){
    // find campground by id
    Blog.findById(req.params.id, function(err, blog){
     if(err){
         console.log(err);
     } else {
          res.render("comments/new", {blog: blog});
     }
 })
 });
 
 //Comments create
 router.post("/", middleware.isLoggedIn  , function(req, res){
   //lookup campground using ID
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save()
               blog.comments.push(comment);
               blog.save();
               res.redirect('/blogs/' + blog._id);
           }
        });
       }
   });
   
 });

 

//Comment: edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(
    req,
    res
  ) {
    // look for the specific comment in db to edit
    Blog.findById(req.params.id, function(err, foundBlog) {
      if (err || !foundBlog) {
        req.flash("error", "No Menu found");
        return res.redirect("/blogs");
      }
      // Edit comment once found in db
      Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
          res.redirect("back");
        }
        // show the edit route so users can update the comment
        else {
          res.render("comments/edit", {
            blog_id: req.params.id,
            comment: foundComment
          });
        }
      });
    });
  });
  
  //COMMENT UPDATE
  router.put("/:comment_id", middleware.checkCommentOwnership, function(
    req,
    res
  ) {
    // Look for comment by id in db to update
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
      err,
      updatedComment
    ) {
      if (err) {
        res.redirect("back");
      }
      //  go back the updated menu
      else {
        res.redirect("/blogs/" + req.params.id);
      }
    });
  });
  
  //COMMENT DESTROY ROUTE
  router.delete("/:comment_id", middleware.checkCommentOwnership, function(
    req,
    res
  ) {
    //findByIdAnd Remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      // check for error and return back
      if (err) {
        res.redirect("back");
      }
      // notify comment was deleted
      else {
        req.flash("success", "Comment deleted");
        res.redirect("/blogs/" + req.params.id);
      }
    });
  });
 module.exports = router;