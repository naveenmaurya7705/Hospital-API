const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.create = async function (req, res) {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (user) {
      return res.status(409).json({
        message: 'UserName Already Exists',
      });
    }

    user = await User.create({
      username: req.body.username,
      password: req.body.password,  // Consider hashing the password in the future
      name: req.body.name,
      type: 'Doctor',
    });

    return res.status(201).json({
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          type: user.type,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ username: req.body.username });  // Changed req.query to req.body

    if (!user || user.password !== req.body.password) {
      return res.status(422).json({
        message: 'Invalid UserName or Password',
      });
    }

    // If using hashed passwords in the future, use bcrypt.compare(req.body.password, user.password)

    return res.status(200).json({
      message: 'Sign in successful. Here is your token, please keep it safe',
      data: {
        token: jwt.sign(user.toJSON(), 'Alert1234', { expiresIn: '1000000' }),
      },
    });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
