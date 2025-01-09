const User = require('../models/User');
const RootUser = require('../models/rootuser'); // Import RootUser model


exports.getUsers = async (req, res) => {
  try {
   
    const rootUserId = req.body.rootUserId; 
    console.log(rootUserId,"dsfdsaf");
    const users = await User.find({ rootUser: rootUserId }).populate('rootUser');
    console.log("pasha ",users );
    return res.status(200).json({  users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.createUser = async (req, res) => {
  try {
    
    const rootUserId = req.params.rootUserId || req.body.rootUserId;

    const rootUser = await RootUser.findById(rootUserId);
    
    if (!rootUser) {
      return res.status(404).json({ message: 'RootUser not found' });
    }

    // console.log(req.body,"fsdfdsf");

  
    const user = new User({
      name: req.body.newUser.name,
      breakfastTime: req.body.newUser.breakfastTime,
      lunchTime: req.body.newUser.lunchTime,
      dinnerTime: req.body.newUser.dinnerTime,
      rootUser: rootUserId, 
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
   
    const rootUserId = req.params.rootUserId || req.body.rootUserId;
    if (rootUserId) {
      const rootUser = await RootUser.findById(rootUserId);
      if (!rootUser) {
        return res.status(404).json({ message: 'RootUser not found' });
      }
    }

    // Find the user by ID and update with new data
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
