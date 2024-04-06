const express = require("express");
const router = express.Router();
const review = require("../models/review.models");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.controllers");

// checking the backend is working
router.get("/", getReviews);

router.get("/:id", getReview);

router.post("/", createReview);

router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

module.exports = router;
