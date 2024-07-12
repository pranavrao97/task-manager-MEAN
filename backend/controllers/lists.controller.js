const { List, Task } = require("../db/models/index");

const getAllLists = (req, res) => {
  List.find({
    _userId: req.user_id,
  })
    .then((lists) => {
      res.send(lists);
    })
    .catch((err) => {
      res.send(err);
    });
};

const createList = (req, res) => {
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
};

const updateList = (req, res) => {
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
};

const deleteList = (req, res) => {
  List.deleteOne({ _id: req.params.id, _userId: req.user_id })
    .then((lists) => {
      res.send(lists);

      // delete all the tasks that belong to the deleted list
      deleteTasksFromList(lists._id);
    })
    .catch((err) => {
      res.send(err);
    });
};

const deleteTasksFromList = (_listId) => {
  Task.deleteMany({
    _listId,
  }).then(() => {
    console.log("deleted tasks successfully!");
  });
};

module.exports = {
  getAllLists,
  createList,
  updateList,
  deleteList,
};
