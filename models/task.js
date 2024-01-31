const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  unique_id:Number,
  title: String,
  description: String,
  due_date: Date,
  priority: {type: Number, enum:[0, 1, 2, 3, 4, 5]},
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  is_deleted:{
    type:Boolean,
    default:false
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
