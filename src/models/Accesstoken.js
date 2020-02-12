const mongoose = require("mongoose");

const AccesstokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      default: null
    },
    expiresAt: {
      type: Date,
      default: new Date()
    },
    userId: {
      type: String,
      required: true
    },
    accessFromIP: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Accesstoken", AccesstokenSchema);
