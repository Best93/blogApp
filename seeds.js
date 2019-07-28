var mongoose = require("mongoose");
var Blog = require("./models/blogs");
var Comment = require("./models/comments");

/*
var data = [
  {
    title: " Burger",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=631&q=80",
   
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam,doloremque doloribus a, fuga expedita laborum ab quos illo et, id nisi?Debitis fugiat iure corrupti ducimus quia cum quidem aut consectetur"
      
  },
  {
    title: " Burger",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=631&q=80",
    
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam,doloremque doloribus a, fuga expedita laborum ab quos illo et, id nisi?Debitis fugiat iure corrupti ducimus quia cum quidem aut consectetur"
      
  },
  {
   
    title: " Burger",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=631&q=80",
    
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam,doloremque doloribus a, fuga expedita laborum ab quos illo et, id nisi?Debitis fugiat iure corrupti ducimus quia cum quidem aut consectetur"
      
  }
];
*/

function seedBlog() {
  //Remove all menu
  Blog.deleteMany({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("removed menu!");
    Comment.deleteMany({}, function(err) {
      if (err) {
        console.log(err);
      }
      console.log("removed comments!");
      //add a few food
     /* 
      data.forEach(function(seed) {
        Blog.create(seed, function(err, blog) {
          if (err) {
            console.log(err);
          } else {
            console.log("added a blog");
            //create a comment
            Comment.create(
              {
                text: "This place is great, but I wish there was internet",
                author: "Homer"
              },
              function(err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  blog.comments.push(comment);
                  blog.save();
                  console.log("Created new comment");
                }
              }
            );
          }
        });
      });
      */
    });
  });
  //add a few comments
}

module.exports = seedBlog