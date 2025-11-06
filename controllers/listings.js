const listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
  let allListings = await listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new listing(req.body);
  newListing.owner = res.locals.currUser;
  newListing.image = { url, filename };
  await newListing.save();
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
  let originalUrl = obj.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/h_300,w_250");
  console.log(originalUrl);
  res.render("./listings/edit.ejs", { obj, originalUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let newObj = req.body;
  let obj = await listing.findByIdAndUpdate(id, { ...newObj });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    obj.image = { url, filename };
    await obj.save();
  }
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleted = await listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
