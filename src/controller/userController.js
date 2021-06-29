const db = require("../database/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = db;

const registerUser = async (req, res, next) => {
  try {
    console.log(req.body);
    let userExits = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExits) {
      return res.status(400).json({
        msg: "User Already Exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(req.body.password, salt);

    let user = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: password,
      role: req.body.role,
    });

    console.log(user.email);

    const accessToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.SECRET
    );
    res.status(201).json(accessToken);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const signInUser = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: { email: req.body.email },
    });
    console.log("Getting to this place 1");
    if (!user) {
      console.log("problem");
      res.status(404).json({ message: "invalid sign in details" });
    }
    console.log("Getting to this place 2");
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "invalid sign in details",
      });
    }
    console.log("Getting to this place 3");
    const accessToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.SECRET
    );
    res.status(200).json({ token: accessToken, message: "Sign in successful" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

module.exports = { registerUser, signInUser };
