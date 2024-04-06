const reviewSchema = require("../models/review");
const review = require("../models/review");

const getReviews = async (req, res) => {
    try {
        const reviews = await review.find({});
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).jsond({ message: error, message });
    }
};

const getReview = async (req, res) => {
    try {
        const id = req.params.id;
        const reviewById = await review.findOne({_id: id});
        res.status(200).json(reviewById);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createReview = async (req, res) => {
    try {
        const reviewData = {
            user_details: req.body.user_details,
            review_comment: req.body.review_comment,
            rating: req.body.rating,
        };
        const review = await reviewSchema.create(reviewData);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedReview = await reviewSchema.findByIdAndUpdate(id, req.body, {
            new: true,
        }); // Use reviewSchema instead of review
        if (!updatedReview) {
            return res.status(404).json({ messages: "Review not found" });
        }
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await reviewSchema.findByIdAndDelete(id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
};