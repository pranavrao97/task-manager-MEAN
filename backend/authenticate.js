const { User } = require("./db/models/index");
const jwt = require("jsonwebtoken");

// check whether the request has a valid JWT token
const authenticate = (req, res, next) => {
  let token = req.header("x-access-token");

  jwt.verify(token, User.getJwtSecret(), (err, decoded) => {
    if (err) {
      res.status(401).send(err);
    } else {
      req.user_id = decoded._id;
      next();
    }
  });
};

const verifySession = (req, res, next) => {
  let refreshToken = req.header("x-refresh-token");
  let _id = req.header("_id");

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        return Promise.reject({
          error:
            "User not found. Make sure that the user id and token are valid",
        });
      }

      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
        if (session.token === refreshToken) {
          if (!User.hasRefreshTokenExpired(session.expiresAt)) {
            isSessionValid = true;
          }
        }
      });

      if (isSessionValid) next();
      else
        return Promise.reject({
          error: "Refresh token has expired or the session is invalid",
        });
    })
    .catch((err) => {
      res.status(401).send(err);
    });
};

module.exports = { authenticate, verifySession };
