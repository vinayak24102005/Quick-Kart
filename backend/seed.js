// Fills the database with sample products so the shop is not empty.
//
//   npm run seed             adds the products (does nothing if products already exist)
//   npm run seed -- --reset  deletes ALL products and carts first, then adds them again
//
// Images are placeholders. Replace the `image` links with real photos any time.

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Cart = require("./models/Cart");

const image = (text) =>
    `https://placehold.co/600x400/e0f2fe/0369a1?text=${encodeURIComponent(text)}`;

const products = [
    { name: "Wireless Headphones", category: "Electronics", price: 59.99, stock: 25,
      description: "Over-ear Bluetooth headphones with deep bass, soft ear cushions and up to 30 hours of battery life.",
      image: image("Wireless Headphones") },
    { name: "Smart Watch", category: "Electronics", price: 89.0, stock: 15,
      description: "Track your steps, heart rate and sleep, and get phone notifications right on your wrist.",
      image: image("Smart Watch") },
    { name: "Bluetooth Speaker", category: "Electronics", price: 34.5, stock: 40,
      description: "Pocket-sized, water-resistant speaker that fills a room with clear sound.",
      image: image("Bluetooth Speaker") },
    { name: "Mechanical Keyboard", category: "Electronics", price: 72.0, stock: 20,
      description: "Compact keyboard with tactile switches and backlighting, great for typing and coding.",
      image: image("Mechanical Keyboard") },

    { name: "Classic Denim Jacket", category: "Fashion", price: 64.99, stock: 18,
      description: "A timeless denim jacket with a comfortable fit that goes with almost everything.",
      image: image("Denim Jacket") },
    { name: "Running Shoes", category: "Fashion", price: 79.95, stock: 30,
      description: "Lightweight, breathable running shoes with a cushioned sole for all-day comfort.",
      image: image("Running Shoes") },
    { name: "Cotton T-Shirt", category: "Fashion", price: 14.99, stock: 100,
      description: "Soft, everyday t-shirt made from 100% cotton. Simple, comfortable and easy to wash.",
      image: image("Cotton T-Shirt") },
    { name: "Everyday Backpack", category: "Fashion", price: 39.0, stock: 35,
      description: "Roomy backpack with a padded laptop pocket and water-resistant fabric.",
      image: image("Backpack") },

    { name: "Ceramic Mug Set", category: "Home", price: 24.5, stock: 50,
      description: "Set of four hand-glazed ceramic mugs, perfect for coffee, tea or hot chocolate.",
      image: image("Ceramic Mug Set") },
    { name: "LED Desk Lamp", category: "Home", price: 29.99, stock: 28,
      description: "Adjustable desk lamp with three brightness levels and a gentle, eye-friendly light.",
      image: image("LED Desk Lamp") },
    { name: "Scented Candle", category: "Home", price: 12.0, stock: 60,
      description: "Hand-poured soy candle with a calming lavender scent and about 40 hours of burn time.",
      image: image("Scented Candle") },
    { name: "Vintage Poster Print", category: "Home", price: 18.0, stock: 0,
      description: "Retro-style art print on thick paper. Currently sold out, so it shows how out-of-stock items look.",
      image: image("Vintage Poster") },

    { name: "Notebook Set", category: "Stationery", price: 9.99, stock: 80,
      description: "Pack of three ruled notebooks with sturdy covers for notes, journaling or study.",
      image: image("Notebook Set") },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const reset = process.argv.includes("--reset");
        const existing = await Product.countDocuments();

        if (existing > 0 && !reset) {
            console.log(`Database already has ${existing} products. Nothing changed.`);
            console.log("Run `npm run seed -- --reset` to replace them.");
            return;
        }

        if (reset) {
            await Product.deleteMany();
            await Cart.deleteMany(); // carts would point to products that no longer exist
        }

        await Product.insertMany(products);
        console.log(`Added ${products.length} products.`);
    } catch (error) {
        console.error(`Seeding failed: ${error.message}`);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seed();
