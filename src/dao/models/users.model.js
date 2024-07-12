const mongoose = require("mongoose");

const userCollection = "Users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: String,
  rol: { type: String, default: "user" },
});

const firstCollection = mongoose.model(userCollection, userSchema);

module.exports = firstCollection;
