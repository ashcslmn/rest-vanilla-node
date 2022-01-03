const { User } = require('../models/index');
const getPostData = require('../supports/getPostData');

const JsonHeader = {
    'Content-Type': 'application/json',
};
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @desc    Register User
 * @route   POST /api/auth/registration
 */
async function registerUser(req, res) {
    try {
        const body = await getPostData(req);

        const { email, firstName, lastName, password } = JSON.parse(body);

        const hashedPassword = bcrypt.hashSync(password, 8);

        const user = await User.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400, // expires in 24 hours
        });

        res.writeHead(200, JsonHeader);
        res.end(JSON.stringify({ authenticated: true, token }));
    } catch (err) {
        res.writeHead(400, JsonHeader);
        res.end(JSON.stringify(err));
    }
}

/**
 * @desc    Login AuthUser
 * @route   POST /api/auth/login
 */
async function loginUser(req, res) {
    try {
        const body = await getPostData(req);
        const { email, password } = JSON.parse(body);

        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            res.writeHead(200, JsonHeader);
            res.end(
                JSON.stringify({
                    authenticated: false,
                    message: 'no user found',
                })
            );
            return false;
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            res.writeHead(401, JsonHeader);
            res.end(
                JSON.stringify({
                    authenticated: false,
                    token: null,
                    message: 'invalid password',
                })
            );
            return false;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400, // expires in 24 hours
        });

        res.writeHead(200, JsonHeader);
        res.end(JSON.stringify({ authenticated: true, token }));
    } catch (err) {
        res.writeHead(400, JsonHeader);
        res.end(JSON.stringify(err));
    }
}

/**
 * @desc    Logout AuthUser
 * @route   DELETE /api/auth/logout
 */
async function logoutUser(req, res) {
    try {
        res.writeHead(200, JsonHeader);
        res.end(JSON.stringify({ token: null, authenticated: false }));
    } catch (err) {
        res.writeHead(400, JsonHeader);
        res.end(JSON.stringify(err));
    }
}

/**
 * @desc    Get Auth Me
 * @route   GET /api/auth/me
 */
async function getMe(req, res, token) {
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            where: {
                id: decode.id,
            },
        });

        if (!user) throw Error('no user');

        res.writeHead(200, JsonHeader);
        res.end(JSON.stringify({ authenticated: true, user, token }));
    } catch (err) {
        res.writeHead(400, JsonHeader);
        res.end(JSON.stringify(err.message));
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
};
