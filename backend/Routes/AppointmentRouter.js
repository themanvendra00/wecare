const express = require("express");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { AppointmentModel } = require("../Models/AppointmentModel");

const AppointmentRouter = express.Router();

let config = {
  service: "gmail",
  auth: {
    user: process.env.weCareEmail,
    pass: process.env.password,
  },
  port: 425,
  host: "smtp.gmail.com",
};

let transporter = nodemailer.createTransport(config);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "WeCare",
    link: "https://wecare.com/",
  },
});

AppointmentRouter.get("/getall", async (req, res) => {
  try {
    let Data = await AppointmentModel.find({});
    res.send(Data);
  } catch (error) {
    res.send({ Error: error.message });
  }
});

AppointmentRouter.get("/get/:email", async (req, res) => {
  let email = req.params.email;
  try {
    let Data = await AppointmentModel.find({ email });
    res.send(Data);
  } catch (error) {
    res.send({ Error: error.message });
  }
});

AppointmentRouter.get("/doctor/get/:doctor", async (req, res) => {
  let doctor = req.params.doctor;
  try {
    let Data = await AppointmentModel.find({ doctor });
    res.send(Data);
  } catch (error) {
    res.send({ Error: error.message });
  }
});

AppointmentRouter.post("/create", async (req, res) => {
  try {
    let date = req.body.date;
    let time = req.body.time;
    let email = req.body.email;
    let Data = await AppointmentModel.findOne({ date, time });
    if (Data) {
      res.send({ message: "Slot Not Available" });
    } else {
      try {
        let appointment = new AppointmentModel(req.body);
        await appointment.save();
        res.send({ message: "Appointment Created" });

        let response = {
          body: {
            name: "",
            intro: [
              "Thanks for booking an appointment you will be notified whenever your appointment will be approved.",
            ],
            action: "",
            outro: ["We request you to join on time."],
          },
        };

        let mail = MailGenerator.generate(response);

        let message = {
          from: process.env.weCareEmail,
          to: email,
          subject: `Appointment Booked for ${date}, ${time}`,
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
      } catch (error) {
        res.send({ Error: error.message });
      }
    }
  } catch (error) {
    res.send({ Error: error.message });
  }
});

AppointmentRouter.patch("/update/:id", async (req, res) => {
  let payload = req.body;
  let { status, name } = req.body;
  req.body.roomId = num;
  let paramid = req.params.id;
  let email = req.headers.email;

  let num = Math.floor(Math.random() * (9999 - 1000) + 1000);
  try {
    await AppointmentModel.findByIdAndUpdate(
      { _id: paramid },
      payload
    );
    res.send({ mess: "Status Updated" });
  } catch (error) {
    res.send({ Error: error.message });
  }

  if (payload == "approved") {
    let response = {
      body: {
        name,
        intro: [
          `Hello ${name}, your appointment has been ${status}, Put ${num} room id to connect with your veterinarian, You can proceed with the CONNECT section of the website`,
        ],
        action: "",
        outro: ["We request you to join on time."],
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: process.env.weCareEmail,
      to: email,
      subject: `Your appiontment is approved`,
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
  } else {
    let response = {
      body: {
        name,
        intro: [
          `Hello ${name}, your appointment has been ${status}, Try different time slot!`,
        ],
        action: "",
        outro: ["We apologize for the inconvenience."],
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: process.env.weCareEmail,
      to: email,
      subject: `Your appointment got rejected!`,
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

module.exports = { AppointmentRouter };
