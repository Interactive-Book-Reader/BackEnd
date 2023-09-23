const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* The code is defining a Mongoose schema for a collection called `PublisherOTPVerification`. The
schema specifies the structure and data types of the documents that will be stored in the
collection. */
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
