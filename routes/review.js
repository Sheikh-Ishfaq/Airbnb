const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing");
const ExpressError = require("../util/ExpressError");
const wrapAsync = require("../util/wrapAsync");
const review = require("../models/review");
const { reviewSchema } = require("../schema.js");

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
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListing = await listing.findById(id);
    let newReview = await review.insertMany(req.body.review);
    newListing.reviews.push(newReview[0]);
    let result = await newListing.save();
    req.flash("success", "Review added");
    res.redirect(`/listings/${id}`);
  })
);

// DELETE REVIEW ROUTE

router.delete(
  "/:review_id",
  wrapAsync(async (req, res) => {
    let { id, review_id } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await review.findByIdAndDelete(review_id);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
