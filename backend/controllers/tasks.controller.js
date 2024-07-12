const { List, Task } = require("../db/models/index");

const getAllTasks = (req, res) => {
  Task.find({ _listId: req.params.listId })
    .then((lists) => {
      res.send(lists);
    })
    .catch((err) => {
      res.send(err);
    });
};

const getTaskById = (req, res) => {
  Task.findOne({ _listId: req.params.listId, _id: req.params.id })
    .then((lists) => {
      res.send(lists);
    })
    .catch((err) => {
      res.send(err);
    });
};

const createTask = (req, res) => {
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
};

const updateTask = (req, res) => {
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
};

const deleteTask = (req, res) => {
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
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
