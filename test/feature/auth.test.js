/* eslint-disable no-undef */
const { User } = require('../../app/models/index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

const user = {
    firstName: 'Ashley',
    lastName: 'Solomon',
    email: 'ashcslmn@gmail.com',
    password: 'secret',
    confirmPassword: 'secret',
};

// eslint-disable-next-line no-unused-vars
describe('Auth /api/auth', () => {
    before((done) => {
        User.destroy({ truncate: true });
        done();
    });

    describe('/POST api/auth/registration', () => {
        it('it should register user', (done) => {
            chai.request(server)
                .post('/api/auth/registration')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('authenticated').eql(true);
                    res.body.should.have.property('token');
                    done();
                });
        });
    });

    describe('/POST api/auth/login', () => {
        it('it should login user', (done) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({ email: user.email, password: user.password })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('authenticated').eql(true);
                    res.body.should.have.property('token');
                    done();
                });
        });
    });

    describe('/POST api/auth/me', () => {
        it('it should show user', (done) => {
            // eslint-disable-next-line no-unused-vars
            new Promise((resolve, reject) => {
                User.findOne({
                    where: {
                        email: user.email,
                    },
                }).then((user) => {
                    const token = jwt.sign(
                        { id: user.id },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: 86400, // expires in 24 hours
                        }
                    );
                    resolve(token);
                });
            }).then((token) => {
                chai.request(server)
                    .get('/api/auth/me')
                    .auth(token, { type: 'bearer' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });
    });
});
