// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/Orders.controllers");

// Route to fetch all past orders
router.get("/", orderController.getAllOrders);

// Route to fetch a specific past order by ID
router.get("/:id", orderController.getOrderById);

module.exports = router;
