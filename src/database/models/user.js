'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "User must have a firstname" },
        notEmpty: { msg: "firstname must not be empty" },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "User must have a lastname" },
        notEmpty: { msg: "lastname must not be empty" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "User must have a email" },
        notEmpty: { msg: "email must not be empty" },
        isEmail: { msg: "Must be a valid email" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "User must have a password" },
        notEmpty: { msg: "password must not be empty" },
      },
    },
    role: {
      type: DataTypes.STRING,
      type: DataTypes.ENUM,
      values: ["customer", "admin"],
      defaultValue: "customer",
      allowNull: false,
      validate: {
        notNull: { msg: "User must have a role" },
        notEmpty: { msg: "Role must not be empty" },
      },
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};