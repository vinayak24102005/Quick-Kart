const { Schema, model } = require("mongoose");

// A line in an order. Name, image and price are COPIED from the product at
// purchase time, so old orders keep showing what the customer actually bought
// even if the product is edited or removed later.
const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false });

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [orderItemSchema],

    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true }
    },

    total: {
        type: Number,
        required: true
    },

    // Chosen on the payment step (so it is empty right after checkout)
    paymentMethod: {
        type: String,
        enum: ["card", "upi", "cod"]
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "refunded"],
        default: "pending"
    },
    paidAt: {
        type: Date
    },

    // Where the order is in its life. "shipped" and "delivered" would be set
    // by an admin panel, which this project does not have.
    status: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled"],
        default: "processing"
    }
}, { timestamps: true });

module.exports = model("Order", orderSchema);
