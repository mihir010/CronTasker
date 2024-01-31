const express = require("express")
const mongoose = require('mongoose');
// const authMiddleWare = require('./middlewares/auth')
const cookieParser = require("cookie-parser")
const taskController = require('./controllers/taskController')
const userController = require('./controllers/userController')
const cronJobs = require('./helpers/cronJobs');
const app = express();

app.listen(5000)


mongoose.connect("mongodb+srv://kumarmihir02:mihir@gofirst.sj5svf3.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log("error while connecting to db: " + err)
})

app.use(express.json());
app.use(cookieParser());

app.post('/api/tasks',taskController.createTask);
app.post('/api/subtasks', taskController.createSubTask);
app.get('/api/tasks', taskController.getAllUserTasks);
app.get('/api/subtasks', taskController.getAllUserSubTasks);
// app.put('/api/tasks/:taskId', authMiddleWare.authenticateToken, taskController.updateTask);
app.put('/api/subtasks/:subtask_id', taskController.updateSubTask);
app.post('/api/tasks/:task_id', taskController.deleteTask);
app.post('/api/subtasks/:subtask_id', taskController.deleteSubTask);

app.post('/api/users/signup', userController.createUser);
app.post('/api/users/login', userController.userLogin);