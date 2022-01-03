'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    firstName: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter your first name'
        }
      }
    },
    lastName: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter your last name'
        }
      }
    },
    address:  { 
      allowNull: true,
      type: DataTypes.TEXT('tiny')
    },
    postalcode: { 
      allowNull: true,
      type: DataTypes.BIGINT(11),
    },
    phoneNumber: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    email: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { 
        isEmail: true
      }
    },
    username: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};