const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const ExpressError = require("../util/ExpressError.js");
const wrapAsync = require("../util/wrapAsync.js");
const review = require("../models/review");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// INDEX ROUTE
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    let allListings = await listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

// NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

// CREATE ROUTE
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let data = req.body;
    data.owner = res.locals.currUser;
    await listing.insertOne(data);
    req.flash("success", "Listing added Successfully");
    res.redirect("/listings");
  })
);

// SHOW ROUTE
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id).populate("reviews").populate("owner");
    if (!data) {
      req.flash("failure", "Listing does not exist");
      res.redirect("/listings");
    }

    res.render("./listings/show.ejs", { data });
  })
);

// EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let obj = await listing.findById(id);
    if (!obj) {
      req.flash("failure", "Listing does not exist");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { obj });
  })
);

// UPDATE ROUTE
router.patch(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let obj = await listing.findById(id);
    let newObj = req.body;
    await listing.findByIdAndUpdate(id, { ...newObj });
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  })
);

// DELETE ROUTE
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
