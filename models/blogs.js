var mongoose = require("mongoose");


// Mongoose/ Model Config
var blogSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId:String,
    createdAt: { type: Date, default: Date.now },
    description: String,
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
   ],
   likes: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      }
   ]

  });

  module.exports = mongoose.model("Blog", blogSchema);
