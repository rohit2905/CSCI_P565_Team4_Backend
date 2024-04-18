const mongoose = require("mongoose");
const reviewsSchema = mongoose.Schema(
    {
        user_details: {
            type: String,
            required: true,
            unique: false,
        },
        review_comment: {
            type: String,
            required: true,
            unique: false,
        },
        rating: {
            type: Number,
            required: true,
        },
        tracking_id:{
            type:String,
            required:true,
        },
    },
    { timestamps: true }
);




const reviewSchema = mongoose.model("Review", reviewsSchema);

module.exports = reviewSchema;