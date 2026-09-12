const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // This will automatically delete the document after the specified time
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('Otp', otpSchema);