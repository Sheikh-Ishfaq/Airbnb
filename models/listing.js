const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("../models/review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    url: String,
    filename: String,
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (Listing) => {
  if (Listing.reviews.length) {
    await review.deleteMany({ _id: { $in: Listing.reviews } });
  }
});

let listing = mongoose.model("listing", listingSchema);
module.exports = listing;
