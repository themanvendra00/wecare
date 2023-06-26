const express = require("express");
const { UserModel } = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const userRouter = express.Router();

let config = {
  service: "gmail",
  auth: {
    user: process.env.weCareEmail,
    pass: process.env.password,
  },
};

let transporter = nodemailer.createTransport(config);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "WeCare",
    link: "https://wecare.com/",
  },
});

userRouter.post("/register", async (req, res) => {
  let { name, dob, gender, contact, email, password } = req.body;

  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist) {
    return res
      .status(200)
      .send({ success: false, message: "User Already Exist" });
  }

  try {
    bcrypt.hash(password, 4, async (err, hashedPassword) => {
      if (err) {
        console.log("err: ", err);
      } else {
        const newUser = new UserModel({
          name,
          dob,
          gender,
          contact,
          email,
          password: hashedPassword,
        });
        await newUser.save();
        res
          .status(200)
          .send({ success: true, message: "Register Successfully" });

        let response = {
          body: {
            name,
            intro: [
              "I hope this email finds you well. On behalf of WeCare, I would like to extend a warm thank you for registering with us. We greatly appreciate your decision to join our community and look forward to serving you.",
            ],
            action: "",
            outro: [
              "Once again, we sincerely thank you for choosing to register with us. Your trust and confidence in our organization mean a lot to us, and we are excited to embark on this journey together. We cannot wait to see the great things that lie ahead for you within our community.",
            ],
          },
        };

        let mail = MailGenerator.generate(response);

        let message = {
          from: process.env.weCareEmail,
          to: email,
          subject: "Welcome to the WeCare.com! – Thanks for joining us",
          html: mail,
        };

        transporter
          .sendMail(message)
          .then(() => {
            return console.log("you sholud receive an email");
          })
          .catch((error) => {
            return console.log(error);
          });
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

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
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

// userRouter.patch("/update", async (req, res) => {
//   try {
//     let newdata = req.body;
//     let id = req.query.id;
//     let user = await UserModel.findByIdAndUpdate({ _id: id }, newdata);
//     res.send({ mess: "User Details Updated" });
//   } catch (error) {
//     res.send({ Error: error.message });
//   }
// });

// userRouter.get("/logout", async (req, res) => {
//   try {
//     let email = req.headers.email;
//     await client.HDEL("tokensObj", email);
//     res.send({ mess: "Logout Successful" });
//   } catch (error) {
//     res.send({ Error: error.message });
//   }
// });

module.exports = { userRouter };
