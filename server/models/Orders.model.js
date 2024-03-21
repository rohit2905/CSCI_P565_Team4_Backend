// models/Order.js
// Attributes
// TrackingID
// Address_f
// Address_t
// Cost
// Carrier
// Size
// Weight
// PriorityStatus
// PaymentStatus
// Customer
// __v
// Location
// OrderStatus
// Driver

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    TrackingId: {
      type: Number,
      required: true,
      unique: true,
    },
    Address_f: {
      type: String,
      required: true,
      unique: true,
    },
    Address_t: {
      type: String,
      required: true,
      unique: true,
    },
    Cost: {
      type: Number,
      required: true,
    },
    Carrier: {
      type: String,
      required: true,
    },
    Size: {
      type: String,
      required: true,
    },
    Weight: {
      //   type: String,
      //   enum: ["Pending", "Delivered", "Cancelled"],
      //   default: "Pending",
      type: String,
      required: true,
    },
    // Add timestamps
    PriorityStatus: {
      type: String,
      required: true,
    },

    PaymentStatus: {
      type: String,
      required: false,
    },
    Customer: {
      type: String,
      required: true,
    },
    __v: {
      type: Number,
      required: true,
    },
    Location: {
      type: String,
      required: false,
    },
    OrderStatus: {
      type: String,
      required: false,
    },
    Drive: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
