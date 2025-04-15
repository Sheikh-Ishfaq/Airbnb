const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing");
const ExpressError = require("../util/ExpressError");
const wrapAsync = require("../util/wrapAsync");
const review = require("../models/review");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
//const validateReview = require("../middleware.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// REVIEW POST ROUTE
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListing = await listing.findById(id);
    let newReview = await new review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    newListing.reviews.push(newReview);
    let result = await newListing.save();
    req.flash("success", "Review added");
    res.redirect(`/listings/${id}`);
  })
);

// DELETE REVIEW ROUTE

router.delete(
  "/:review_id",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    let { id, review_id } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await review.findByIdAndDelete(review_id);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
