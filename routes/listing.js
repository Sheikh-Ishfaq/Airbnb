const express = require("express");
const router = express.Router();
const ExpressError = require("../util/ExpressError.js");
const wrapAsync = require("../util/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// INDEX ROUTE AND CREATE LISTING ROUTE
router.route("/").get(wrapAsync(listingController.index));
// .post(validateListing, wrapAsync(listingController.createListing));

router.post("/", upload.single("image"), (req, res) => {
  res.send(req.file);
});
// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW , PATCH AND DELETE ROUTE
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .patch(validateListing, isOwner, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
