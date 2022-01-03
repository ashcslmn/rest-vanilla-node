require("dotenv").config();
const http = require("http");
const jwt = require("jsonwebtoken");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  bulkDeleteUser,
} = require("./app/controllers/users.controller");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("./app/controllers/auth.controller");

const server = http.createServer((req, res) => {
  const UNAUTHENTICATEDURL = [
      '/api/auth/registration',
      '/api/auth/login'
  ]
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!UNAUTHENTICATEDURL.includes(req.url)) {
    /**
     * @desc JWT Validations
     */
    if (!token) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
        JSON.stringify({ authenticated: false, message: "No token provided." })
        );
        return false;
    }
    
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            authenticated: false,
            message: "Failed to authenticate token.",
          })
        );
        return false;
      }
    });
  }

  /**
   * @desc AUTH user
   */
  if (req.url === '/api/auth/registration' && req.method === "POST") {
    return registerUser(req, res);
  } else if (req.url === "/api/auth/login" && req.method === "POST") {
    return loginUser(req, res);
  } else if (req.url === "/api/auth/logout" && req.method === "DELETE") {
    return logoutUser(req, res, token);
  } else if (req.url === "/api/auth/me" && req.method === "GET") {
    return getMe(req, res, token);
  }

  /**
   * @desc CRUD user
   */
  if (req.url === "/api/users" && req.method === "POST") {
    return createUser(req, res);
  } else if (req.url === "/api/users" && req.method === "GET") {
    return getUsers(req, res);
  } else if (
    req.url.match(/\/api\/users\/\w+/) &&
    (req.method === "PATCH" || req.method === "PUT")
  ) {
    const id = req.url.split("/")[3];
    return updateUser(req, res, id);
  } else if (req.url === "/api/users/bulkDelete" && req.method === "DELETE") {
    return bulkDeleteUser(req, res);
  } else if (req.url.match(/\/api\/users\/\w+/) && req.method === "DELETE") {
    const id = req.url.split("/")[3];
    return deleteUser(req, res, id);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route Not Found" }));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = server;
