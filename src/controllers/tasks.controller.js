import Tasks from "../models/Tasks.js";
import { getPagination } from "../libs/getPagination.js";
("../libs/getPagination.js");

export const findAllTasks = async (req, res) => {
  try {
    const { size, page, title } = req.query;

    const condition = title
      ? {
          title: { $regex: new RegExp(title), $options: "i" },
        }
      : {};

    const { limit, offset } = getPagination(page, size);

    const tasks = await Tasks.paginate(condition, { offset, limit });
    res.send(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something goes wrong retrieving the tasks",
    });
  }
};

export const createTask = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send("Content cannot be empty");
  }

  try {
    const newTask = new Tasks({
      title: req.body.title,
      description: req.body.description,
      done: req.body.done ? req.body.done : false,
    });
    const taskSaved = await newTask.save();
    res.json(taskSaved);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something goes wrong creating a task",
    });
  }
};

export const findOneTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Tasks.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id ${id} does not exists` });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error searching for a task",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Tasks.findByIdAndDelete(id);
    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id ${id} does not exists` });
    }
    res.json({
      message: `${req.params.id} Task were deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error deleting a task",
    });
  }
};

export const findAllDoneTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find({ done: true });
    if (!tasks) {
      return res.status(404).json({ message: "No completed task exists" });
    }
    res.send(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error searching for completed tasks",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Tasks.findByIdAndUpdate(id, req.body);
    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id ${id} does not exists` });
    }
    res.json({ message: "Task was updated successfuly" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error searching for a task",
    });
  }
};
