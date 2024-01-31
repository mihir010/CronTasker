const cron = require("node-cron");
const Task = require("../models/task");
const User = require("../models/user");
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// const accountSid = "USb1f2fe21e2b501607bdc1b447676093b";
// const authToken = "8f4205d3f9a1603737f7d66ae2179c2e";
// const client = new twilio(accountSid, authToken);

const makeVoiceCall = async (phoneNumber) => {
  try {
    // const phoneNumberString = `+${phoneNumber}`;
    const call = await client.calls.create({
      to: "91" + phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      url: "http://demo.twilio.com/docs/voice.xml", // Replace with your TwiML URL
    });

    console.log(
      `Voice call initiated to ${phoneNumber} - Call SID: ${call.sid}`
    );
  } catch (error) {
    console.error("Error making voice call:", error);
  }
};

const initiateVoiceCalls = async () => {
  try {
    // Find tasks that are not soft-deleted and have passed their due_date
    const overdueTasks = await Task.find({
      is_deleted: false,
      due_date: { $lt: new Date() },
      status: { $ne: "DONE" }, // Only consider tasks that are not completed
    }).sort({ priority: 1 }); // Sort tasks based on priority ascending

    // Group tasks by user_id
    const tasksByUser = overdueTasks.reduce((acc, task) => {
      acc[task.user_id] = acc[task.user_id] || [];
      acc[task.user_id].push(task);
      return acc;
    }, {});

    // Iterate over users based on priority and initiate voice calls for their overdue tasks
    for (let priority = 0; priority <= 2; priority++) {
      const usersWithPriority = await User.find({ priority });

      for (const user of usersWithPriority) {
        const userTasks = tasksByUser[user._id];

        if (userTasks && userTasks.length > 0) {
          // Initiate voice call for the first overdue task of the user
          const phoneNumber = user.phone_number;
          await makeVoiceCall(phoneNumber);

          // You can add additional logic here if needed

          console.log(
            `Voice call initiated for user ${user._id} with priority ${priority}`
          );
        }
      }
    }

    console.log("Voice calls initiated successfully");
  } catch (error) {
    console.error("Error initiating voice calls:", error);
  }
};

cron.schedule(
  "0 0 * * *",
  () => {
    initiateVoiceCalls();
  },
  {
    timezone: "Asia/Kolkata", // Replace with your timezone, e.g., 'America/New_York'
  }
);

module.exports = initiateVoiceCalls;
