const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../util/ExpressError");
const wrapAsync = require("../util/wrapAsync");
const { isLoggedIn, isAuthor, validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// REVIEW POST ROUTE
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addReview)
);

// DELETE REVIEW ROUTE

router.delete(
  "/:review_id",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
