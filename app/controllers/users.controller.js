const { User } = require("../models/index");
const getPostData = require("../supports/getPostData");
const JsonHeader = {
  "Content-Type": "application/json",
};
const { Op } = require("sequelize");

/*
 * @desc    Create User
 * @route   POST /api/users
 */
async function createUser(req, res) {
  try {
    const body = await getPostData(req);

    const { email, firstName, lastName, address, postalcode } = JSON.parse(body);
    
    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      address,
      postalcode
    });

    res.writeHead(200, JsonHeader);
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(400, JsonHeader);
    res.end(JSON.stringify(err));
  }
}

/*
 * @desc    Delete User
 * @route   Delete /api/users/:id
 */
async function deleteUser(req, res, id) {
  try {
    const user = await User.destroy({
      where: {
        id
      },
    });

    res.writeHead(200, JsonHeader);
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(400, JsonHeader);
    res.end(JSON.stringify(err));
  }
}

/*
 * @desc    Update User
 * @route   PATCH | PUT /api/users/:id
 */
async function updateUser(req, res, id) {
  try {
    const body = await getPostData(req);

    const { firstName, lastName, address, postalcode } = JSON.parse(body);

    const user = await User.update(
      {
        firstName,
        lastName,
        address,
        postalcode
      },
      {
        where: {
          id
        }
      }
    );

    res.writeHead(200, JsonHeader);
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(400, JsonHeader);
    res.end(JSON.stringify(err));
  }
}

/*
 * @desc    Get Users
 * @route   GET /api/users
 */
async function getUsers(req, res) {
  try {
    const users = await User.findAll();

    res.writeHead(200, JsonHeader);
    res.end(JSON.stringify(users));
  } catch (err) {
    res.writeHead(400, JsonHeader);
    res.end(JSON.stringify(err));
  }
}

/*
 * @desc    Delete User
 * @route   Delete /api/users/bulkDelete
 */
async function bulkDeleteUser(req, res) {
  try {
    const body = await getPostData(req);

    const { ids } = JSON.parse(body);

    const users = await User.destroy({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });

    res.writeHead(200, JsonHeader);
    res.end(JSON.stringify(users));
  } catch (err) {
    res.writeHead(400, JsonHeader);
    res.end(JSON.stringify(err));
  }
}

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  getUsers,
  bulkDeleteUser
};
