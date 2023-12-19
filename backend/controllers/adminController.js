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

exports.addVendor = async (req, res) => {
    const { name, email, password, category } = req.body;
  
    try {
      // Check if the vendor with the provided email already exists
      const existingVendor = await User.findOne({ email, role: 'vendor' });
  
      if (existingVendor) {
        return res.status(400).json({ error: 'Vendor with the provided email already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
  
      // Add new vendor
      const newVendor = new User({
        name,
        email,
        password : hashedPassword,
        role: 'vendor',
        category,
      });
  
      await newVendor.save();
  
      res.json({ message: 'Vendor added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.getAllVendors = async (req, res) => {
    try {
      // Fetch all vendors
      const vendors = await User.find({ role: 'vendor' }, { password: 0 });
  
      res.json({ vendors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getAllUsers = async (req, res) => {
    try {
      // Fetch all users
      const users = await User.find({ role: 'user' }, { password: 0 });
  
      res.json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
exports.vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch vendor by email and role
    const vendor = await User.findOne({ email, role: 'vendor' });
    console.log('Vendor:', vendor);

    if (vendor && bcrypt.compareSync(password, vendor.password)) {
      console.log('Password Matched');
      const token = generateToken(vendor);
      res.json({
        vendor: {
          _id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          role: vendor.role,
          category: vendor.category,
          // Include any other vendor details you want in the response
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