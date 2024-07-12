const { User } = require("../db/models/index");

const signUpUser = (req, res) => {
  let body = req.body;
  let newUser = new User(body);
  newUser
    .save()
    .then(() => {
      return newUser.createSession();
    })
    .then((refreshToken) => {
      return newUser.generateAccessTokens().then((accessToken) => {
        return { accessToken, refreshToken };
      });
    })
    .then((authToken) => {
      res
        .header("x-refresh-token", authToken.refreshToken)
        .header("x-access-token", authToken.accessToken)
        .send(newUser);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const login = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findByCredentials(email, password).then((user) => {
    return user
      .createSession()
      .then((refreshToken) => {
        return user.generateAccessTokens().then((accessToken) => {
          return { accessToken, refreshToken };
        });
      })
      .then((authToken) => {
        res
          .header("x-refresh-token", authToken.refreshToken)
          .header("x-access-token", authToken.accessToken)
          .send(user);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });
};

const refreshAccessToken = (req, res) => {
  req.userObject
    .generateAccessTokens()
    .then((accessToken) => {
      res.header("x-access-token", accessToken).send({ accessToken });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = {
  signUpUser,
  login,
  refreshAccessToken,
};
