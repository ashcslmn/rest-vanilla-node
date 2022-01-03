const { User } = require("../../app/models/index");
const bcrypt = require("bcryptjs");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const should = chai.should();
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);

describe("Auth /api/auth", () => {
  const user = {
    firstName: "Ashley",
    lastName: "Solomon",
    email: "ashcslmn@gmail.com",
    password: "secret",
    confirmPassword: "secret",
  };

  before((done) => {
    User.destroy({ truncate: true });
    done();
  });

  /**
   * Test /POST api/auth/registration
   */
  describe("/POST api/auth/registration", () => {
    it("it should register user", (done) => {
      chai
        .request(server)
        .post("/api/auth/registration")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("authenticated").eql(true);
          res.body.should.have.property("token");
          done();
        });
    });
  });

  describe("/POST api/auth/login", () => {
    it("it should login user", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({ email: "ashcslmn@gmail.com", password: "secret" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("authenticated").eql(true);
          res.body.should.have.property("token");
          done();
        });
    });
  });

  describe("/POST api/auth/me", () => {
    let token = null;
    User.findOne({
      where: {
        email: user.email,
      },
    }).then((user) => {
      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 86400, // expires in 24 hours
      });
    });

    it("it should show user", (done) => {
      chai
        .request(server)
        .get("/api/auth/me")
        .auth(token, { type: "bearer" })
        .send({ email: user.email, password: user.secret })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});
