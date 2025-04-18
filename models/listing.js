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
    type: String,
    default:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",

    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
        : v,
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
