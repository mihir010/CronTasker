const cron = require('node-cron');
const Task = require('../models/task');

const updateTaskPriority = async () => {
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
    // Find tasks that are not soft-deleted and have a due date
    const tasks = await Task.find({user_id, is_deleted: false, due_date: { $ne: null } });

    // Iterate over tasks and update priority based on due date
    tasks.forEach(async (task) => {
      const currentDate = new Date();
      const dueDate = new Date(task.due_date);

      // Calculate the difference in days
      const timeDifference = dueDate.getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      // Update priority based on daysDifference
      if (daysDifference === 0) {
        task.priority = 0;
      } else if (daysDifference <= 2) {
        task.priority = 1;
      } else if (daysDifference <= 4) {
        task.priority = 2;
      } else {
        task.priority = 3;
      }

      // Save the updated task
      await task.save();
    });

    console.log('Task priorities updated successfully');
  } catch (error) {
    console.error('Error updating task priorities:', error);
  }
};

// Schedule the cron job to run every day at midnight (0:0)
cron.schedule('0 0 * * *', () => {
  updateTaskPriority();
}, {
  timezone: 'Asia/Kolkata', // Replace with your timezone, e.g., 'America/New_York'
});

module.exports = updateTaskPriority;
