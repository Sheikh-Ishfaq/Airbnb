const listing = require("../models/listing");
module.exports.index = async (req, res, next) => {
  let allListings = await listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  let data = req.body;
  data.owner = res.locals.currUser;
  await listing.insertOne(data);
  req.flash("success", "Listing added Successfully");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let data = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!data) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  }

  res.render("./listings/show.ejs", { data });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let obj = await listing.findById(id);
  if (!obj) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { obj });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let obj = await listing.findById(id);
  let newObj = req.body;
  await listing.findByIdAndUpdate(id, { ...newObj });
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleted = await listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
