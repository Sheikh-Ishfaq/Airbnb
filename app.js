const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/ExpressError");
const ListingRoute = require("./routes/listing.js");
const ReviewRoute = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const UserRoute = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const sessionOptions = {
  secret: "superSecretCode",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("./listings/root.ejs");
});
app.use("/listings", ListingRoute);
app.use("/listings/:id/reviews", ReviewRoute);
app.use("/", UserRoute);

// PAGE NOT FOUND HANDLER
app.all("*", (req, res, next) => {
  throw new ExpressError(404, "Page not found");
});

// CUSTOM ERROR HANDLER
app.use((err, req, res, next) => {
  let { status = 400, message = "something went wrong!" } = err;
  // res.status(status).render("error.ejs", { message });
  res.status(status).render("error.ejs", { message });
});

app.listen(8080, (req, res) => {
  console.log("Listening to the port 8080");
});
