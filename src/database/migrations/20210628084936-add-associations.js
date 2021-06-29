'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */


      return queryInterface.addColumn(
        'accounts',
        'UserId',
        {
          type: Sequelize.INTEGER,
          references: {
            'model': 'Users',
            'key': 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
      .then(() => {
        return queryInterface.addColumn(
          'transactions',
          'UserId',
          {
            type: Sequelize.INTEGER,
            references: {
              'model': 'Users',
              'key': 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        )
      });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
      return queryInterface.removeColumn(
        'accounts',
        'userId'
      )
      .then(() => {
        // remove Payment hasOne Order
        return queryInterface.removeColumn(
          'transactions', // name of the Target model
          'userId' // key we want to remove
        );
      });
  }
};
