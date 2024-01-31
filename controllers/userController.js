const User = require('../models/user');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user')
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");

const createUser = async (req, res) => {
  try {
    const { phone_number, priority, password } = req.body;

    const dup_users = await UserModel.find({phone_number})

    // console.log(dup_users)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if(dup_users.length > 0){
      return res.json({error: "user with provided phone number already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      phone_number,
      priority,
      password: hashedPassword,
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ phone_number });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid phone number' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Unauthorized - Invalid password' });
    }

    // if (user.password !== password) {
    //   return res.status(401).json({ error: 'Unauthorized - Invalid password' });
    // }

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

