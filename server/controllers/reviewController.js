const reviewSchema = require("../models/review");
const review = require("../models/review");

const getReviews = async (req, res) => {
    const user=req.query.useremail
    try {
        const reviews = await review.find({user_details:user});
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error, message });
    }
};

// const getReview = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const reviewById = await review.findOne({_id: id});
//         res.status(200).json(reviewById);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const getAllReviewsForAdmin = async (req, res) => {
    try {
        const reviewById = await review.find({});
        res.status(200).json(reviewById);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createReview = async (req, res) => {
    try {
        const reviewData = {
            user_details: req.body.email,
            review_comment: req.body.review,
            rating: req.body.rating,
            tracking_id: req.body.tracking_id
        };

        const reviewInstance = new reviewSchema(reviewData);
        await reviewInstance.save();

        res.status(201).json({
            message: "You have successfully created the review",
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const updateReview = async (req, res) => {
//     try {
//         const user =req.query.useremail
//         const updatedReview = await reviewSchema.findByIdAndUpdate(user_details, req.body, {
//             new: true,
//         }); // Use reviewSchema instead of review
//         if (!updatedReview) {
//             return res.status(404).json({ messages: "Review not found" });
//         }
//         res.status(200).json(updatedReview);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


const updateReview = async (req, res) => {
    try {
      const { useremail, TrackingID } = req.query;
      console.log(useremail, TrackingID);
  
      const updatedReview = await reviewSchema.findOneAndUpdate(
        { user_details: useremail, tracking_id: TrackingID },
        {
          $set: {
            review_comment: req.body.review,
            rating: req.body.rating,
          },
        },
        {
          new: true,
        }
      );
  
      console.log(updatedReview);
  
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
        const { TrackingId } = req.query;
        const review = await reviewSchema.findOneAndDelete({ tracking_id: TrackingId});

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
    getAllReviewsForAdmin,
    createReview,
    updateReview,
    deleteReview,
};