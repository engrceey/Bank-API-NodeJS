const db = require("../database/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = db;

const registerUser = async (req, res, next) => {
  try {
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

    res.send(getJsonToken(user));

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

    if (!user) {
      res.status(404).json({ message: "invalid sign in details" });
    }

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

    res.send(getJsonToken(user));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const getJsonToken = (user) => {
  const accessToken = jwt.sign(
    { email: user.email, role: user.role },
    process.env.SECRET,
    { expiresIn: "120m" }
  );
  return { token: accessToken };
};

const getUser = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) return res.status(400).json({ message: "user does not exist" });
    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(req.user);
    if (!users) return res.status(404).send("No user found");
    res.status(200).json({ data: users });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const updateUser = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) return res.status(400).json({ message: "user does not exist" });

    if (req.user.email !== user.email)
      return res.status(403).json("You can't edit this Profile");

    const result = await User.update(
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone_number: req.body.phonenumber,
      },

      {
        where: {
          email: req.body.email,
        },
      }
    );

    let updatedUser = await User.findOne({
      where: { email: req.body.email },
    });

    res.status(200).json({ data: updatedUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) return res.status(400).json({ message: "user does not exist" });

    await User.destroy({
      where: {
        email: req.body.email,
      },
    });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

module.exports = {
  registerUser,
  signInUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
