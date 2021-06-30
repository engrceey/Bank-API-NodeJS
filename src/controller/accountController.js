const db = require("../database/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { account, User } = db;

const createAccount = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() === "admin")
      return res.status(200).json({ message: "Admin can not have an account" });

    let accnt = await account.findOne({
      where: { accountHolder: req.user.email },
    });

    if (accnt) {
      return res.status(200).json({ message: "you already have an account" });
    }

    const salt = await bcrypt.genSalt(10);
    let newPin = await bcrypt.hash(req.body.pin, salt);

    let user = await User.findOne({
      where: { email: req.user.email },
    });

    let genAccountNumber = Math.floor(1000000000 + Math.random() * 900000000);

    let newAccount = await account.create({
      accountHolder: req.user.email,
      pin: newPin,
      accountType: req.body.accountType,
      UserId: user.id,
      accountNumber: genAccountNumber,
    });

    res.status(201).json({ account: newAccount });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const changePin = async (req, res) => {
  try {    

    const accnt = await account.findOne({
      where: { accountHolder: req.user.email },
    });

    const accntPin = accnt.pin;

    const pinIsValid = bcrypt.compareSync(
      req.body.oldpin,
      accntPin
    );

    if(!pinIsValid) return res.status(400).json({"message": "Pin is incorrect"})

    const salt = await bcrypt.genSalt(10);
    let newPin = await bcrypt.hash(req.body.pin, salt);
    
    const result = await account.update(
      {
        pin: newPin,
      },
      {
        where: {
          accountHolder: accnt.accountHolder,
        },
      }
    );

    res.status(200).json({"new pin": req.body.pin})

  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

module.exports = { createAccount, changePin };
