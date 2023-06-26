const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DoctorModel } = require("../Models/DoctorModel");

const doctorRouter = express.Router();

doctorRouter.get("/",async(req,res)=>{
  try {
    const doctors = await DoctorModel.find();
    res.send(doctors)
  } catch (error) {
    console.log({ Error: error.message });
    res.send({ Error: error.message });
  }
})

doctorRouter.get("/getDocID", async (req, res) => {
  try {
    let name = req.headers.name;
    let user = await DoctorModel.findOne({ name: name });
    res.send({ ID: user._id });
  } catch (error) {
    console.log({ Error: error.message });
    res.send({ Error: error.message });
  }
});


doctorRouter.post("/register", async (req, res) => {
  let { name, email, password, gender, age, experience, specialization } =
    req.body;

  const isUserExist = await DoctorModel.findOne({ email });
  if (isUserExist) {
    return res
      .status(200)
      .send({ success: false, message: "Doctor Already Exist" });
  }

  try {
    bcrypt.hash(password, 4, async (err, hashedPassword) => {
      if (err) {
        console.log("err: ", err);
      } else {
        const newUser = new DoctorModel({
          name,
          gender,
          age,
          experience,
          specialization,
          email,
          password: hashedPassword,
        });
        await newUser.save();
        res
          .status(200)
          .send({ success: true, message: "Register Successfully" });
      }
    });
  } catch (error) {
    console.log({ Error: error.message });
    res.status(500).send({
      success: false,
      message: `Error in Register Controller ${error.message}`,
    });
  }
});

doctorRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await DoctorModel.find({ email });
    const hashed_password = user[0]?.password;
    if (user.length > 0) {
      bcrypt.compare(password, hashed_password, (err, result) => {
        if (result) {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });
          res.status(200).send({
            success: true,
            message: "Login Success",
            token,
            User: user[0],
          });
        } else {
          res
            .status(200)
            .send({ success: false, message: "Invalid Email or Password" });
        }
      });
    } else {
      res.status(200).send({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Error in Login Controller ${error.message}`,
    });
  }
});

doctorRouter.delete("/delete", async (req, res) => {
  try {
    let id = req.query.id;
    let user = await DoctorModel.findByIdAndDelete({ _id: id });
    res.send({ mess: "Doctor Deleted" });
  } catch (error) {
    res.send({ Error: error.message });
  }
});

module.exports = { doctorRouter };
