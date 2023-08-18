const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticator = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          console.log("Please Login");
          res.send({ message: "Please Login Again" });
        } else {
          req.body.userID = decoded.userID;
          next();
        }
      }
    );
  } else {
    console.log("Please Login First");
    res.send({ message: "Please Login First" });
  }
};
module.exports = { authenticator };
