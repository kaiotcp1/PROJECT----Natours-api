const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const Tour = require("./../models/tourModel");
const Review = require("./../models/reviewModel");
const User = require("./../models/userModel");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then((con) => {
  console.log("DB Connection successful!");
});

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const review = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
// IMPORT DATA DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(review);
    await User.create(users, {validateBeforeSave: false});

    console.log("Data SUCCESFFULLY loaded!!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELET ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();

    console.log("Data SUCCESFFULLY deleted!!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
