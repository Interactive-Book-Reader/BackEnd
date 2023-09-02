const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PublisherOTPVerificationSchema = new Schema({
    publisherId: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,      
    },
    expiresAt: {
        type: Date,        
    }
});

const PublisherOTPVerification = mongoose.model('PublisherOTPVerification', PublisherOTPVerificationSchema);

module.exports = PublisherOTPVerification;
