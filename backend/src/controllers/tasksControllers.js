import Task from "../models/Task.js";

const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;

  switch (filter) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "all":
    default: {
      startDate = null;
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : {};

  try {
    const result = await Task.aggregate([
      {
        $match: query,
      },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completedCount: [
            { $match: { status: "completed" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completedCount = result[0].completedCount[0]?.count || 0;
    res.status(200).json({
      tasks,
      activeCount,
      completedCount,
    });
  } catch (err) {
    console.log("Đã xảy ra lỗi khi gọi getAllTask: ", err);
    res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.log("Đã xảy ra lỗi khi gọi createTask: ", err);
    res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, status, completedAt },
      {
        returnDocument: "after",
      },
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại." });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    console.log("Đã xảy ra lỗi khi gọi updateTask: ", err);
    res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại." });
    }
    res.status(200).json({ deletedTask });
  } catch (err) {
    console.log("Đã xảy ra lỗi khi gọi deleteTask.");
    res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

export { getAllTasks, createTask, updateTask, deleteTask };
