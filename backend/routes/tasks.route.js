const express = require("express");
const { authenticate } = require("../authenticate");
const router = express.Router({ mergeParams: true });
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks.controller");

/**
 * GET - return array of tasks
 */
router.get("/", authenticate, getAllTasks);

/**
 * GET - return one task
 */
router.get("/:id", authenticate, getTaskById);

/**
 * POST - create a Task
 */
router.post("/", authenticate, createTask);

/**
 * PATCH - update a task
 */
router.patch("/:id", authenticate, updateTask);

/**
 * DELETE - delete a task
 */
router.delete("/:id", authenticate, deleteTask);

module.exports = router;
