const db = require("../database/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { account, User, transaction, sequelize } = db;

const deposit = async (req, res) => {
  try {
    const admin = await User.findOne({
      where: { email: req.user.email },
    });

    const adminPin = admin.password;
    const passwordIsValid = bcrypt.compareSync(req.body.pin, adminPin);

    if (!passwordIsValid)
      return res.status(400).json({ message: "Password is incorrect" });

    let receivingAccount = await account.findOne({
      where: { accountNumber: req.body.to },
    });

    if (!receivingAccount)
      return res
        .status(400)
        .json({ error: "Account number " + req.body.to + " is incorrect" });

    let newBalance = receivingAccount.accountBalance + req.body.amount;

    let t = await sequelize.transaction();

    await account.update(
      {
        accountBalance: newBalance,
        currency: req.body.currency,
      },
      { where: { accountNumber: receivingAccount.accountNumber } },
      {
        transaction: t,
      }
    );

    const trans = await transaction.create(
      {
        transactionType: req.body.transactionType,
        from: "Admin",
        to: receivingAccount.accountNumber,
        status: "SUCCESS",
        amount: req.body.amount,
        UserId: receivingAccount.UserId,
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    res.status(200).json({ message: trans });
  } catch (err) {
    console.error(err);
    await t.rollback();
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const withdraw = async (req, res) => {
  try {
    const accnt = await account.findOne({
      where: { accountHolder: req.user.email },
    });

    const accntPin = accnt.pin;

    const pinIsValid = bcrypt.compareSync(req.body.pin, accntPin);

    if (!pinIsValid)
      return res.status(400).json({ message: "Pin is incorrect" });

    let newBalance = accnt.accountBalance - req.body.amount;

    if (newBalance < 0)
      return res.status(200).json({ message: "Insufficient funds" });

    let t = await sequelize.transaction();

    try {
      const result = await sequelize.transaction(async (t) => {
        await account.update(
          {
            accountBalance: newBalance,
            currency: req.body.currency,
          },
          { where: { accountNumber: accnt.accountNumber} },
          {
            transaction: t,
          }
        );

        const trans = await transaction.create(
          {
            transactionType: req.body.transactionType,
            from: accnt.accountHolder,
            to: accnt.accountNumber,
            status: "SUCCESS",
            amount: req.body.amount,
            UserId: accnt.UserId,
          },
          {
            transaction: t,
          }
        );

        res.status(200).json({ message: trans });
      });
    } catch (error) {
      throw new Error(error);
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const getTransaction = async (req, res) => {
  try {
    const accnt = await account.findOne({
      where: { accountHolder: req.user.email },
    });

    const accntPin = accnt.pin;

    const pinIsValid = bcrypt.compareSync(req.body.pin, accntPin);

    if (!pinIsValid)
      return res.status(400).json({ message: "Pin is incorrect" });

    let trans = await transaction.findAll(
      {
        attributes: [
          "transactionType",
          "amount",
          "from",
          "to",
          "status",
          "createdAt",
        ],
      },
      {
        where: { to: accnt.accountNumber },
      },
      { limit: 5 }
    );

    res.status(200).json({ data: trans });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const admin = await User.findOne({
      where: { email: req.user.email },
    });

    const adminPin = admin.password;
    const passwordIsValid = bcrypt.compareSync(req.body.password, adminPin);

    if (!passwordIsValid)
      return res.status(400).json({ message: "Password is incorrect" });

    let getAccount = await account.findOne({
      where: { accountNumber: req.body.accountNumber },
    });

    if (!getAccount)
      return res.status(400).json({
        error: "Account number " + req.body.accountNumber + " is incorrect",
      });

    let trans = await transaction.findAll(
      {
        attributes: [
          "transactionType",
          "amount",
          "from",
          "to",
          "status",
          "createdAt",
        ],
      },
      {
        where: { to: req.body.accountNumber },
      }
    );

    res.status(200).json({ data: trans });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

const transfer = async (req, res) => {
  try {
    const accnt = await account.findOne({
      where: { accountHolder: req.user.email },
    });

    const accntPin = accnt.pin;

    const pinIsValid = bcrypt.compareSync(req.body.pin, accntPin);

    if (!pinIsValid)
      return res.status(400).json({ message: "Pin is incorrect" });

    let sendersAccountBalance = accnt.accountBalance - req.body.amount;

    if (sendersAccountBalance < 0)
      return res.status(200).json({ message: "Insufficient funds" });

    const receiversAccnt = await account.findOne({
      where: { accountNumber: req.body.receiversAccountNumber },
    });

    if (!receiversAccnt)
      return res.status(404).json({
        message:
          "Account number " + req.body.receiversAccountNumber + " is incorrect",
      });

    let receiversBalance = receiversAccnt.accountBalance + req.body.amount;

    let t = await sequelize.transaction();

    try {
      const result = await sequelize.transaction(async (t) => {
        await account.update(
          {
            accountBalance: receiversBalance,
            currency: req.body.currency,
          },
          { where: { accountNumber: req.body.receiversAccountNumber } },
          {
            transaction: t,
          }
        );

        await account.update(
          {
            accountBalance: sendersAccountBalance,
            currency: req.body.currency,
          },
          { where: { accountNumber: accnt.accountNumber } },
          {
            transaction: t,
          }
        );

        const trans = await transaction.create(
          {
            transactionType: req.body.transactionType,
            from: accnt.accountHolder,
            to: req.body.receiversAccountNumber,
            status: "SUCCESS",
            amount: req.body.amount,
            UserId: accnt.UserId,
          },
          {
            transaction: t,
          }
        );

        res.status(200).json({ message: trans });
      });
    } catch (error) {
      throw new Error(error);
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, we're working on it" });
  }
};

module.exports = {
  deposit,
  withdraw,
  getTransaction,
  getAllTransactions,
  transfer,
};
