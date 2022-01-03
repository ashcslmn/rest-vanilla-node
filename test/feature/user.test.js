const { User } = require("../../app/models/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const should = chai.should();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
chai.use(chaiHttp);

let auth = {
  firstName: "Ashley",
  lastName: "Solomon",
  email: "ashcslmn@gmail.com",
  password: "secret",
  confirmPassword: "secret",
};

let user = {
  firstName: "Juan",
  lastName: "Dela Cruz",
  email: "juan@example.com",
  password: "secret",
  confirmPassword: "secret",
};

let token = null;

describe("Users /api/users", () => {
  beforeEach((done) => {
    new Promise(async (resolve, reject) => {
      await User.destroy({ truncate: true });
      auth.password = bcrypt.hashSync(auth.password, 8);
      await User.create(auth).then((user) => {
        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: 86400, // expires in 24 hours
        });
      });
      resolve(true);
    }).then(() => done());
  });

  /**
   * Test /POST api/users
   */
  describe("/POST api/users", () => {
    it("it should add user", (done) => {
      chai
        .request(server)
        .post("/api/users")
        .auth(token, { type: "bearer" })
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  /**
   * Test /GET api/users
   */
  describe("/GET api/users", () => {
    it("it should get users", (done) => {
      chai
        .request(server)
        .get("/api/users")
        .auth(token, { type: "bearer" })
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  /**
   * Test /DELETE api/users/:id
   */
  describe("/DELETE api/users/:id", () => {
    it("it should delete user", (done) => {
      new Promise((resolve, reject) => {
        User.create(user).then((item) => {
          resolve(item);
        });
      }).then((item) => {
        chai
          .request(server)
          .delete(`/api/users/${item.id}`)
          .auth(token, { type: "bearer" })
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("number").eql(1);
            done();
          });
      });
    });
  });

  /**
   * Test /GET api/users/bulkDelete
   */
  describe("/GET api/users/bulkDelete", () => {
    it("it should bulkDelete user", (done) => {
      new Promise(async (resolve, reject) => {
        User.findOne({}).then((user) => {
          resolve(user);
        });
      }).then((item) => {
        chai
          .request(server)
          .delete(`/api/users/bulkDelete`)
          .auth(token, { type: "bearer" })
          .send({ ids: [item.id] })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("number").eql(1);
            done();
          });
      });
    });
  });
});
