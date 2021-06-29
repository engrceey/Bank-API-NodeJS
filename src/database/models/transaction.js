"use strict";
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define(
    "transaction",
    {
      transactionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      transactionType: {
        type: DataTypes.ENUM,
        values: ["transfer", "withdraw", "deposit"],
      },
      from: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["SUCCESS", "FAILED", "PENDING"],
        defaultValue: "PENDING",
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {}
  );
  transaction.associate = function (models) {
    // associations can be defined here
    transaction.belongsTo(models.User)
  };
  return transaction;
};
