const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  oldPrice: Number,
  description: String,
  image: String,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
