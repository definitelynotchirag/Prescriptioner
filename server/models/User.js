const mongoose = require('mongoose');

// Import the RootUser model
const RootUser = require('./rootuser'); // Update with the correct path

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breakfastTime: { type: String, required: true },
  lunchTime: { type: String, required: true },
  dinnerTime: { type: String, required: true },
  rootUser: { type: mongoose.Schema.Types.ObjectId, ref: 'RootUser', required: true }, // Reference to RootUser
});

module.exports = mongoose.model('User', UserSchema);
