const db = require("../database/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendConfirmationEmail } = require("../services/sendEmailService");
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

    const token = getJsonToken(req.body.email, req.body.role);

    console.log(token);

    let user = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: password,
      role: req.body.role,
      phone_number: req.body.phonenumber,
      confirmationCode: token,
    });

    let result = sendConfirmationEmail(
      req.body.firstname,
      req.body.email,
      token
    );

    if (result) {
      return res.json({ token, result });
    } else {
      return res.send("Error Occured");
    }
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const user = User.findOne({
      confirmationCode: req.params.confirmationCode,
    });

    if (!user) {
      return res
        .status(404)
        .send({ message: "Verification failed, Resend Link" });
    }
    await User.update(
      {
        isVerified: "ACTIVE",
      },

      {
        where: {
          confirmationCode: req.params.confirmationCode,
        },
      }
    );

    res.status(200).json({ message: "Email confirmed" });
  } catch (err) {
    console.error(err.message);
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

    res.send(getJsonToken(user.email, user.role));
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const getJsonToken = (Email, Role) => {
  const accessToken = jwt.sign(
    { email: Email, role: Role },
    process.env.SECRET,
    { expiresIn: "120m" }
  );
  return accessToken;
};

const getUser = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) return res.status(400).json({ message: "user does not exist" });
    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    if (!users) return res.status(404).send("No user found");
    res.status(200).json({ data: users });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const updateUser = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: { email: req.user.email },
    });

    const result = await User.update(
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone_number: req.body.phonenumber,
      },

      {
        where: {
          email: user.email,
        },
      }
    );

    let updatedUser = await User.findOne(
      {
        attributes: [
          "firstname",
          "lastname",
          "email",
          "phone_number",
          "createdAt",
        ],
      },
      {
        where: { email: user.email },
      }
    );

    res.status(200).json({ data: updatedUser });
  } catch (err) {
    console.error(err.message);
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
    console.error(err.message);
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
  verifyUser,
};
