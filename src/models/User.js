const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    name: {
      type: String,
      default: null,
      trim: true
    },
    departmentId: {
      type: String,
      default: null
    },
    designation: {
      type: String,
      default: null,
      trim: true
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    },
    password: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
