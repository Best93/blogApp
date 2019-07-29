var express = require("express"),
  app = express(),
  methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  expressSanitizer = require ("express-sanitizer"),
  Blog = require("./models/blogs"),
  mongoose = require("mongoose"),
  Comment = require("./models/comments"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  seedBlog = require("./seeds");
 app.locals.moment = require("moment");

 require('dotenv').config();

 //require routes
var commentsRoutes = require("./routes/comments"),
blogsRoutes = require("./routes/blogs"),
indexRoutes = require("./routes/index");





//seedBlog();
var url = process.env.DATABASEURL || "mongodb://localhost:27017/blogApp";
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true
});
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
// tell express to use flash for
app.use(flash());

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Blogging all day",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Avoid Deprecation 

mongoose.set("useFindAndModify", false);


app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


// requiring routes
app.use("/", indexRoutes);
app.use("/blogs", blogsRoutes);
app.use("/blogs/:id/comments", commentsRoutes);
//set up port
var port = process.env.PORT || 3000;


//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}



// check for server port
app.listen(port, function() {
  console.log("Server just started");
});