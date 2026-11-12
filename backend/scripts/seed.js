// Usage:  npm run seed          -> adds missing sample products + admin user
//         npm run seed -- --fresh -> also wipes products, carts and orders first
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const img = (slug) => `https://picsum.photos/seed/${slug}/600/400`;

const products = [
  ["Wireless Earbuds", "Electronics", 1499, 40, "Bluetooth 5.3 earbuds with noise isolation and 24-hour battery life with the case."],
  ["Smart Watch", "Electronics", 2999, 25, "Fitness tracking, heart-rate monitor and week-long battery in a slim design."],
  ["Bluetooth Speaker", "Electronics", 1799, 30, "Portable water-resistant speaker with deep bass and 12 hours of playtime."],
  ["Power Bank 20000mAh", "Electronics", 1299, 50, "Fast-charging power bank with dual USB output and USB-C input."],
  ["Mechanical Keyboard", "Electronics", 3499, 15, "Compact hot-swappable keyboard with tactile switches and RGB backlight."],
  ["Wireless Mouse", "Electronics", 699, 60, "Ergonomic silent-click mouse with adjustable DPI."],
  ["Cotton T-Shirt", "Fashion", 399, 100, "Soft breathable 100% cotton crew-neck t-shirt, regular fit."],
  ["Slim Fit Jeans", "Fashion", 1199, 45, "Stretch denim jeans with a modern slim fit."],
  ["Running Shoes", "Fashion", 2199, 35, "Lightweight cushioned running shoes with a breathable mesh upper."],
  ["Hooded Sweatshirt", "Fashion", 999, 40, "Warm fleece-lined hoodie with a front pocket."],
  ["Canvas Backpack", "Fashion", 849, 3, "Durable 25L backpack with a padded laptop compartment."],
  ["Stainless Steel Bottle", "Home", 449, 80, "Vacuum insulated 750ml bottle keeps drinks cold for 24 hours."],
  ["LED Desk Lamp", "Home", 799, 28, "Dimmable desk lamp with three colour temperatures and USB charging port."],
  ["Non-stick Cookware Set", "Home", 2499, 12, "5-piece non-stick cookware set suitable for induction and gas."],
  ["Cotton Bedsheet Set", "Home", 1099, 20, "Double bedsheet with two pillow covers, 180 thread count."],
  ["Aroma Diffuser", "Home", 649, 0, "Ultrasonic diffuser with ambient light and auto shut-off."],
  ["Yoga Mat", "Sports", 599, 55, "6mm anti-slip yoga mat with carry strap."],
  ["Dumbbell Set 10kg", "Sports", 1599, 18, "Pair of adjustable dumbbells with anti-roll design."],
  ["Football", "Sports", 549, 40, "Size 5 stitched football for training and match play."],
  ["Skipping Rope", "Sports", 199, 90, "Adjustable speed rope with ball bearings and foam grips."],
  ["Atomic Habits", "Books", 399, 60, "A practical guide to building good habits and breaking bad ones."],
  ["The Pragmatic Programmer", "Books", 899, 22, "Classic guide to becoming a better, more productive software developer."],
  ["Clean Code", "Books", 749, 4, "A handbook of agile software craftsmanship."],
  ["Notebook Pack of 3", "Books", 249, 120, "Ruled A5 notebooks with 160 pages each."],
].map(([name, category, price, stock, description]) => ({
  name,
  category,
  price,
  stock,
  description,
  image: img(name.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
}));

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  if (process.argv.includes("--fresh")) {
    await Promise.all([Product.deleteMany({}), Cart.deleteMany({}), Order.deleteMany({})]);
    console.log("Cleared products, carts and orders");
  }

  let added = 0;
  for (const p of products) {
    const res = await Product.updateOne({ name: p.name }, { $setOnInsert: p }, { upsert: true });
    if (res.upsertedCount) added++;
  }
  console.log(`Products: ${added} added, ${products.length - added} already existed`);

  const email = (process.env.ADMIN_EMAIL || "admin@quickkart.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`Existing user ${email} promoted to admin`);
    } else {
      console.log(`Admin ${email} already exists`);
    }
  } else {
    await User.create({ name: "Admin", email, password: await bcrypt.hash(password, 10), role: "admin" });
    console.log(`Admin created -> ${email} / ${password}  (change this password!)`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
