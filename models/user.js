const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone_number: String,
  password: String,
  priority: { type: Number, enum: [0, 1, 2] },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
