var mongoose = require("mongoose");


// Mongoose/ Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
    body: String,
    author:{
       id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
       },
       username: String
    },

    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]

  });

  module.exports = mongoose.model("Blog", blogSchema);
