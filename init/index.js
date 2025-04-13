const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((el) => ({
    ...el,
    owner: "67fa50935efc276304012465",
  }));
  await listing.insertMany(initData.data);
  console.log("insertion successful");
};

initDb();
