router.post('/signup', async (req, res) => {
    const { name, breakfastTime, lunchTime, dinnerTime, mobile, password } = req.body;
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ mobile });
      if (existingUser) {
        return res.status(400).json({ message: 'Mobile number already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = new User({ name, breakfastTime, lunchTime, dinnerTime, mobile, password: hashedPassword });
      await user.save();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  