const listing = require("../models/listing");
const review = require("../models/review");

module.exports.addReview = async (req, res) => {
  let { id } = req.params;
  let newListing = await listing.findById(id);
  let newReview = await new review(req.body.review);
  newReview.author = req.user._id;
  await newReview.save();
  newListing.reviews.push(newReview);
  let result = await newListing.save();
  req.flash("success", "Review added");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, review_id } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
  await review.findByIdAndDelete(review_id);
  req.flash("success", "Review deleted");
  res.redirect(`/listings/${id}`);
};
