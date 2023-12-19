const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (user) => {
  const payload = { email: user.email, role: user.role };
  return jwt.sign(payload, 'your-secret-key', { expiresIn: '78h' });
};

const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ error: message });
};

exports.userSignup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: 'user' });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          // Include any other user details you want in the response
        },
        token,
      });
    } else {
      sendErrorResponse(res, 401, 'Invalid email or password');
    }
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

exports.adminSignup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const newAdmin = new User({ name, email, password: hashedPassword, role });
    await newAdmin.save();

    res.json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, role: 'admin' });

    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = generateToken(admin);
      res.json({
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          // Include any other admin details you want in the response
        },
        token,
      });
    } else {
      sendErrorResponse(res, 401, 'Invalid email or password');
    }
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

