const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
  task_id: mongoose.Schema.Types.ObjectId,
  status: { type: Number, enum: [0, 1], default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: Date,
  deleted_at: Date,
  is_deleted:{
    type:Boolean,
    default:false
  }
});

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;
