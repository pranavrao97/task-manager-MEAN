const express = require("express");
const { authenticate } = require("../authenticate");
const tasksRoutes = require("./tasks.route");
const {
  getAllLists,
  createList,
  updateList,
  deleteList,
} = require("../controllers/lists.controller");

const router = express.Router();

/* MIDDLWARE */
router.use("/:listId/tasks", tasksRoutes);

/**
 * GET - return array of lists
 */
router.get("/", authenticate, getAllLists);

/**
 * POST - create a new list
 */
router.post("/", authenticate, createList);

/**
 * PATCH - modify list
 */
router.patch("/:id", authenticate, updateList);

/**
 * DELETE - Delete list
 */
router.delete("/:id", authenticate, deleteList);

module.exports = router;
