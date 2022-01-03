const { factory } = require('factory-girl');
const faker = require('faker');
const bcrypt = require('bcryptjs');
const { User } = require('../../app/models/index');

factory.define('user', User, {
    email: () => `${faker.internet.userName().toLocaleLowerCase()}@example.com`,
    firstName: () => faker.name.firstName(),
    lastName: () => faker.name.lastName(),
    address: () => faker.address.streetAddress(),
    postalcode: () => parseInt(faker.address.zipCodeByState()),
    phoneNumber: () => faker.phone.phoneNumberFormat(),
    username: () => faker.internet.userName(),
    password: bcrypt.hashSync('secret', 8),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
});

module.exports = factory;
