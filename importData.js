const mongoose = require("mongoose");
const fs = require("fs");
const Product = require("./models/Product"); // Product modelini düzgün göstər

mongoose
  .connect("mongodb://127.0.0.1:27017/kontakt_home", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB-ə qoşuldu!"))
  .catch((err) => console.error("Qoşulma xətası:", err));

// JSON faylını oxu
const products = JSON.parse(fs.readFileSync("products.json", "utf-8"));

// Məlumatları MongoDB-yə yüklə
const importData = async () => {
  try {
    await Product.insertMany(products);
    console.log("Məhsullar uğurla yükləndi!");
    process.exit();
  } catch (err) {
    console.error("Yükləmə xətası:", err);
    process.exit(1);
  }
};

// Skripti işə sal
importData();
