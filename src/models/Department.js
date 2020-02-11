const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    code: {
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
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Department", DepartmentSchema);
