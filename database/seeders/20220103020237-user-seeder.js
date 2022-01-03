const faker = require('faker');
const userFactory = require('../factory/user.factory');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        userFactory.buildMany('user', 24).then(async (userObjects) => {
            const users = userObjects.map((item) => item.dataValues);
            await queryInterface.bulkInsert('Users', users, {});
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    },
};
