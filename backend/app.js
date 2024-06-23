const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const jwt = require("jsonwebtoken");

const { List, Task, User } = require("./db/models/index");

// Middlewares
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token, _id"
  );
  next();
});

// check whether the request has a valid JWT token
let authenticate = (req, res, next) => {
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

let verifySession = (req, res, next) => {
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

// Route Handlers

/**
 * GET - return array of lists
 */
app.get("/lists", authenticate, (req, res) => {
  List.find({
    _userId: req.user_id,
  })
    .then((lists) => {
      res.send(lists);
    })
    .catch((err) => {
      res.send(e);
    });
});

/**
 * POST - create a new list
 */
app.post("/lists", authenticate, (req, res) => {
  let title = req.body.title;

  const list = new List({
    title,
    _userId: req.user_id,
  });

  list
    .save()
    .then((listDoc) => {
      res.send(listDoc);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * PATCH - modify list
 */
app.patch("/lists/:id", authenticate, (req, res) => {
  List.findOneAndUpdate(
    { _id: req.params.id, _userId: req.user_id },
    {
      $set: req.body,
    }
  )
    .then(() => {
      res.send({ message: "update successful" });
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * DELETE - Delete list
 */
app.delete("/lists/:id", authenticate, (req, res) => {
  List.deleteOne({ _id: req.params.id, _userId: req.user_id })
    .then((lists) => {
      res.send(lists);

      // delete all the tasks that belong to the deleted list
      deleteTasksFromList(lists._id);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * GET - return array of tasks
 */
app.get("/lists/:listId/tasks", authenticate, (req, res) => {
  Task.find({ _listId: req.params.listId })
    .then((lists) => {
      res.send(lists);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * GET - return one task
 */
app.get("/lists/:listId/tasks/:id", authenticate, (req, res) => {
  Task.findOne({ _listId: req.params.listId, _id: req.params.id })
    .then((lists) => {
      res.send(lists);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * POST - create a Task
 */
app.post("/lists/:listId/tasks", authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      return !!list;
    })
    .then((canCreateTasks) => {
      if (canCreateTasks) {
        const title = req.body.title;

        const taskItem = new Task({
          title,
          _listId: req.params.listId,
        });

        taskItem
          .save(taskItem)
          .then((task) => {
            res.send(task);
          })
          .catch((err) => {
            res.send(err);
          });
      } else {
        res.sendStatus(404).send("list not found");
      }
    });
});

/**
 * PATCH - update a task
 */
app.patch("/lists/:listId/tasks/:id", authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      return !!list;
    })
    .then((canUpdateTasks) => {
      if (canUpdateTasks) {
        Task.findOneAndUpdate(
          { _id: req.params.id, _listId: req.params.listId },
          {
            $set: req.body,
          }
        )
          .then(() => {
            res.send({ message: "Task Update Successful" });
          })
          .catch((err) => {
            res.send(err);
          });
      } else {
        res.sendStatus(404).send("list not found");
      }
    });
});

/**
 * DELETE - delete a task
 */
app.delete("/lists/:listId/tasks/:id", authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      return !!list;
    })
    .then((canUpdateTasks) => {
      if (canUpdateTasks) {
        Task.deleteOne({ _id: req.params.id, _listId: req.params.listId })
          .then((removedTask) => {
            res.send(removedTask);
          })
          .catch((err) => {
            res.send(err);
          });
      } else {
        res.sendStatus(404).send("list not found");
      }
    });
});

/* User Routes */

/**
 * POST Users
 */
app.post("/users", (req, res) => {
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
});

app.post("/users/login", (req, res) => {
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
});

app.get("/users/me/accessToken", verifySession, (req, res) => {
  req.userObject
    .generateAccessTokens()
    .then((accessToken) => {
      res.header("x-access-token", accessToken).send({ accessToken });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

let deleteTasksFromList = (_listId) => {
  Task.deleteMany({
    _listId,
  }).then(() => {
    console.log("deleted tasks successfully!");
  });
};

app.listen("3000", () => {
  console.log("server started on port 3000");
});
