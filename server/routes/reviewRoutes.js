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

router.put("/update-review", updateReview);
// router.put("/update-review/:useremail/:TrackingID", updateReview);

router.delete("/delete-review", deleteReview);

module.exports = router;