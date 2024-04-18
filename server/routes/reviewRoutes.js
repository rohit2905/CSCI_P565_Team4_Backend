const express = require("express");
const router = express.Router();
const review = require("../models/review");
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");

// checking the backend is working
router.get("/reviews", getReviews);

router.get("/review/:id", getReview);

router.post("/create-review", createReview);

router.put("/update-review/:id", updateReview);

router.delete("/delete-review/:id", deleteReview);

module.exports = router;