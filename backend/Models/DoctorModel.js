const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    name: String,
    email:String,
    password:String,
    gender: String,
    age: Date,
    experience: String,
    specialization: String,
  },
  {
    versionKey: false,
  }
);

const DoctorModel = mongoose.model("DoctorDetail", doctorSchema);

module.exports = { DoctorModel };
