const jwt = require("jsonwebtoken");
const DB = require("../database/models");
const { User } = DB;

const Authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } catch (e) {
      console.error(err.message);
      res.status(500).send({ message: "Invalid Token" });
    }
  }
};

const isAdmin = async (req, res, next) => {
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "you are unauthorize" });
  }
  next();
};

const isEmailVrified = async (req, res, next) => {
  try {
    const { email } = req.user;

    let loginUser = await User.findOne({
      where: { email: email },
    });

    if (loginUser.isVerified == "PENDING") {
      return res
        .status(200)
        .json({
          message: "Account not veerified, Click email link to verify account",
        });
    } else {
      return next();
    }
  } catch (e) {
    console.error(err.message);
    res.status(500).send({ message: "An error occurred" });
  }
};

module.exports = { Authenticate, isAdmin, isEmailVrified };
