const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({

    CarrierName: {
        type: String,
        required: true,
        trim: true,
        unique: false,
        lowercase: true,
    },
    ServiceType: {
        type: String,
        required: true,
        trim: true,
        unique: false,
        lowercase: true,
    },
    Dimension: {
        type: String,
        required: true,
        trim: true,
        unique: false,
        lowercase: true,
    },
    Price: {
        type: String,
        required: true,
        trim: true,
        unique: false,
        lowercase: true,
    },

},
    {
        timestamp: true,
    }

);

module.exports = mongoose.model("Services", serviceSchema);