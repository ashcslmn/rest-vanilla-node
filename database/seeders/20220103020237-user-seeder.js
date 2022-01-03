'use strict';

const userFactory = require('../factory/user.factory')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
     userFactory.buildMany('user', 24).then(async (userObjects)  =>  {
        let users = userObjects.map((item) => item.dataValues)
        console.log(users);
        await queryInterface.bulkInsert('Users', users, {});
     })
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Users', null, {});
  }
};
