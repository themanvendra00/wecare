const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    dob: Date,
    gender: String,
    contact: Number,
    email: String,
    password: String,
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("UserDetail", userSchema);

module.exports = { UserModel };
