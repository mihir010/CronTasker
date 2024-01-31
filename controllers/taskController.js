const Task = require("../models/task");
const SubTask = require("../models/subtask");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const calculatePriority = (dueDate) => {
    const today = new Date();
    const dueDateObj = new Date(dueDate);
    const timeDifference = dueDateObj.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
    if (daysDifference === 0) {
      return 0; // Due date is today
    } else if (daysDifference <= 2) {
      return 1; // Due date is between tomorrow and day after tomorrow
    } else if (daysDifference <= 4) {
      return 2; // Due date is 3-4 days
    } else if (daysDifference <= 5) {
      return 3; // Due date is 5 days
    } else {
      return 4; // Due date is more than 5 days
    }
  };

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const due_date = new Date(req.body.due_date)
    // Fetch JWT token from the request cookies
    const token = req.cookies.jwt;
    // console.log(req.cookies)

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided - Login first' });
    }

    // Verify the token to get user information
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Extract the _id from the decoded token
    const user_id = decodedToken._id;
    

    const priority = calculatePriority(due_date);

    const task = new Task({
      title,
      description,
      due_date,
      user_id,
      priority,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createSubTask = async (req, res) => {
  try {
    const { task_id } = req.body;

    // Fetch JWT token from the request cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided - Login first' });
    }

    // Verify the token to get user information
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Extract the _id from the decoded token
    const user_id = decodedToken._id;

    // Check if the task_id exists and is associated with the user
    const task = await Task.findOne({ _id: task_id, user_id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized access' });
    }

    // Create the subtask
    const subTask = new SubTask({
      task_id,
      status: 0, // Default status is 0 (incomplete)
    });

    await subTask.save();
    res.status(201).json(subTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllUserTasks = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    // console.log(req.cookies)

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided - Login first' });
    }

    // Verify the token to get user information
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Extract the _id from the decoded token
    const user_id = decodedToken._id;
    const tasks = await Task.find({ user_id: user_id })
      // .populate("subTasks")
      // .populate("user_id");
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUserSubTasks = async (req, res) => {
  try {
    const { task_id } = req.body;

    // Fetch JWT token from the request cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided - Login first' });
    }

    // Verify the token to get user information
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Extract the _id from the decoded token
    const user_id = decodedToken._id;

    const mainTask = await Task.find({_id:task_id, user_id})

    if(!mainTask)
    {
      return res.status(404).json({ error: 'Task not found or unauthorized access' });
    }

    // Check if the task_id exists and is associated with the user
    const subTasks = await SubTask.find({ task_id});

    if (!subTasks) {
      return res.status(404).json({ error: 'Subtasks not found' });
    }

    res.status(200).json(subTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// const updateTask = async (req, res) => {
//   // Implementation logic for updating a task
// };

const updateSubTask = async (req, res) => {
  try {
    const { subtask_id } = req.params;
    const { status } = req.body;

    // Fetch JWT token from the request cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided - Login first' });
    }

    // Verify the token to get user information
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Extract the _id from the decoded token
    const user_id = decodedToken._id;

    // Check if the subtask_id exists and is associated with the user
    const subTask = await SubTask.findOne({ _id: subtask_id});

    if (!subTask) {
      return res.status(404).json({ error: 'Subtask not found or unauthorized access' });
    }

    const task_id = subTask.task_id

    const isAuthorized = await Task.find({_id:task_id, user_id})

    if(!isAuthorized){
      return res.status(404).json({ error: 'unauthorized access' });
    }

    // Update the status of the subtask (allowed values: 0, 1)
    subTask.status = status;
    await subTask.save();

    res.status(200).json({ message: 'Subtask status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const deleteTask = async (req, res) => {
  try {
    const { task_id } = req.params;

    // Fetch JWT token from the request cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided - Login first' });
    }

    // Verify the token to get user information
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Extract the _id from the decoded token
    const user_id = decodedToken._id;

    // Check if the task_id exists and is associated with the user
    const task = await Task.findOne({ _id: task_id, user_id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized access' });
    }

    // Perform soft deletion by setting is_deleted to true
    task.is_deleted = true;
    await task.save();

    // Optionally, you may also soft delete associated subtasks
    // await SubTask.updateMany({ task_id: task_id, user_id: user_id }, { is_deleted: true });

    res.status(200).json({ message: 'Task soft deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteSubTask = async (req, res) => {
  try {
    const { subtask_id } = req.params;

    // Fetch JWT token from the request cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided - Login first' });
    }

    // Verify the token to get user information
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Extract the _id from the decoded token
    const user_id = decodedToken._id;

    
    // Check if the subtask_id exists and is associated with the user
    const subTask = await SubTask.findOne({ _id: subtask_id });
    
    if (!subTask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }
    const task_id = subTask.task_id

    const isAuthorized = await Task.find({_id:task_id, user_id})

    if(!isAuthorized){
      return res.status(404).json({ error: 'unauthorized access' });
    }

    // Perform soft deletion by setting is_deleted to true
    subTask.is_deleted = true;
    
    await subTask.save();

    res.status(200).json({ message: 'Subtask soft deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  createTask,
  createSubTask,
  getAllUserTasks,
  getAllUserSubTasks,
  // updateTask,
  updateSubTask,
  deleteTask,
  deleteSubTask,
};
