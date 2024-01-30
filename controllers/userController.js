const User = require('../models/user');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  try {
    const { phone_number, priority, password } = req.body;
    
    const user = new User({
      phone_number,
      priority,
      password,
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const userLogin = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    const user = await User.findOne({ phone_number });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid phone number' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Unauthorized - Invalid password' });
    }

    const token = jwt.sign({ _id: user._id }, 'your-secret-key'); // Sign the token with user _id
    // console.log(req.cookies)
    res.cookie('jwt', token, { httpOnly: false, secure: false, sameSite: 'none' }).json({ success: true, token})
    // res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createUser,
  userLogin
};

