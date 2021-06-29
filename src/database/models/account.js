'use strict';
module.exports = (sequelize, DataTypes) => {
  const account = sequelize.define('account', {
    accountId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    accountHolder: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    accountNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accountBalance: {
      type: DataTypes.INTEGER,
    },
    accountType: {
        type: DataTypes.ENUM,
                values: [
                    'savings',
                    'current',
                    'foreign'
                ],
                defaultValue: 'savings'
    }
  }, {});
  account.associate = function(models) {
    // associations can be defined here
    account.belongsTo(models.User)

  };
  return account;
};