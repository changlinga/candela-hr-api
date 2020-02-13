const mongoose = require("mongoose");
const _ = require("lodash");

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
    birthDate: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      lowercase: true,
      default: null,
      trim: true
    },
    contactNo: {
      type: String,
      default: null,
      trim: true
    },
    contactNoCountryCode: {
      type: String,
      default: "+65",
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "is not a valid email"]
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
    terminationDate: {
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

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObj = _.omit(user.toObject(), ["password"]);
  return userObj;
};

module.exports = mongoose.model("User", UserSchema);
