const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./util/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("failure", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let obj = await Listing.findById(id);
  if (!obj.owner._id.equals(res.locals.currUser._id)) {
    req.flash("failure", "You are not owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, review_id } = req.params;
  let obj = await Review.findById(review_id);
  if (!obj.author._id.equals(res.locals.currUser._id)) {
    req.flash("failure", "You are not author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
