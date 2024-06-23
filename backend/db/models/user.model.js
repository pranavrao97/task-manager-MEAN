const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const jwtSecrets = "JJfzB6B7GylZyZFeSJUKFLwp5n5FpeYOqarTWqFA";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  sessions: [
    {
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Number,
        required: true,
      },
    },
  ],
});

/* Instance Methods */

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  // return the document script without the password and sessions (These should not be public)
  return _.omit(userObject, ["password", "sessions"]);
};

UserSchema.methods.generateAccessTokens = function () {
  const user = this;
  return new Promise((resolve, reject) => {
    // create a JSON Web token and return it
    jwt.sign(
      { _id: user._id.toHexString() },
      jwtSecrets,
      { expiresIn: "15m" },
      (err, token) => {
        if (!err) resolve(token);
        else reject(err);
      }
    );
  });
};

UserSchema.methods.generateRefreshToken = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (!err) {
        let token = buf.toString("hex");
        return resolve(token);
      }
      return reject(err);
    });
  });
};

UserSchema.methods.createSession = function () {
  let user = this;
  return user
    .generateRefreshToken()
    .then((refreshToken) => {
      return saveSessionToDatabase(user, refreshToken);
    })
    .then((refreshToken) => {
      return refreshToken;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

let saveSessionToDatabase = (user, refreshToken) => {
  // save session to database
  return new Promise((resolve, reject) => {
    let expiresAt = generateRefreshTokenExpiryTime();

    user.sessions.push({ token: refreshToken, expiresAt });
    user
      .save()
      .then(() => {
        return resolve(refreshToken);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/* model methods (static methods) */
UserSchema.statics.findByIdAndToken = function (_id, token) {
  const user = this;
  return user.findOne({
    _id,
    "sessions.token": token,
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  const user = this;
  return user.findOne({ email }).then((user) => {
    if (!user) return Promise.reject();

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) resolve(user);
        else reject(err);
      });
    });
  });
};

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
  let secondsSinceEpoch = Date.now() / 1000;
  if (expiresAt > secondsSinceEpoch) return false;
  return true;
};

UserSchema.statics.getJwtSecret = () => {
  return jwtSecrets;
};

/* middlewares */
UserSchema.pre("save", function (next) {
  let user = this;
  let costFactor = 10;

  if (user.isModified("password")) {
    bcrypt.genSalt(costFactor, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/* helper methods */
let generateRefreshTokenExpiryTime = () => {
  let daysUntilExpire = 10;
  let secondsUntilExpire = daysUntilExpire * 24 * 60 * 60;
  return Date.now() / 100 + secondsUntilExpire;
};

const User = new mongoose.model("User", UserSchema);

module.exports = { User };
