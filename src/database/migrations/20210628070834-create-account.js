'use strict';
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('accounts');
  }
};