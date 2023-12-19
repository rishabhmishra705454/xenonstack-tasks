const Product = require('../models/Product');
const mongoose = require('mongoose');
const User = require("../models/User")
const Order = require('../models/Order');

exports.addProduct = async (req, res) => {
  try {
    const { vendorId, name, price } = req.body;

    // Check if vendorId is provided
    if (!vendorId) {
      return res.status(400).json({ error: 'Vendor ID is required' });
    }

    // Check if the vendorId is valid (you may want to perform additional checks)
    // For simplicity, assume vendorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ error: 'Invalid Vendor ID' });
    }

    // Check if an image file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const image = req.file.path;

    // Create a new product
    const newProduct = new Product({
      vendorId,
      name,
      price,
      image,
    });

    // Save the product to the database
    await newProduct.save();

    res.json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);

    // Check if it's a validation error (e.g., missing required fields)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }

    // Check for other specific errors (add more conditions as needed)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate key error', details: error.keyValue });
    }

    // Handle other generic errors
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getVendorProducts = async (req, res) => {
    try {
      const { vendorId } = req.params;
  
      // Check if the vendorId is valid (you may want to perform additional checks)
      // For simplicity, assume vendorId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).json({ error: 'Invalid Vendor ID' });
      }
  
      // Fetch all products of the specified vendor
      const products = await Product.find({ vendorId });
  
      res.json({ products });
    } catch (error) {
      console.error(error);
  
      // Handle other generic errors
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getVendorsByCategory = async (req, res) => {
    try {
      const { category } = req.body;
  
      if (!category) {
        return res.status(400).json({ error: 'Category parameter is required in the request body' });
      }
  
      const vendors = await User.find({ role: 'vendor', category }, { password: 0 });
  
      res.json({ vendors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getVeyCategory = async (req, res) => {
    try {
      const { category } = req.body;
  
      if (!category) {
        return res.status(400).json({ error: 'Category parameter is required in the request body' });
      }
  
      const vendors = await User.find({ role: 'vendor', category }, { password: 0 });
  
      res.json({ vendors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  exports.getVendCategory = async (req, res) => {
    try {
      const { category } = req.body;
  
      if (!category) {
        return res.status(400).json({ error: 'Category parameter is required in the request body' });
      }
  
      const vendors = await User.find({ role: 'vendor', category }, { password: 0 });
  
      res.json({ vendors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.createOrder = async (req, res) => {
    try {
      const { userId, vendorId, products, orderDetails, grandTotal, totalQuantity } = req.body;
  
      // Validate if userId and vendorId are valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).json({ error: 'Invalid User ID or Vendor ID' });
      }
  
      // Validate if the products array is provided and not empty
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Products array is required and must not be empty' });
      }
  
      // Validate if the products in the array are valid ObjectId references
      for (const product of products) {
        if (!mongoose.Types.ObjectId.isValid(product.productId)) {
          return res.status(400).json({ error: 'Invalid Product ID in the products array' });
        }
  
        // You might want to perform additional checks on the quantity or other details
      }
  
      // Validate other order details here if needed
  
      // Create a new order
      const newOrder = new Order({
        userId,
        vendorId,
        products,
        orderDetails,
        grandTotal,
        totalQuantity,
      });
  
      // Save the order to the database
      await newOrder.save();
  
      res.json({ message: 'Order created successfully' });
    } catch (error) {
      console.error(error);
  
      // Handle different types of errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
  
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  exports.getUserOrders = async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Validate if userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid User ID' });
      }
  
      // Fetch all orders for the specified user, populating the 'products' field to get product details
      const orders = await Order.find({ userId }).populate({
        path: 'products.productId',
        select: 'name image', // Include only the 'name' and 'image' fields of the related product
      });
  
      res.json({ orders });
    } catch (error) {
      console.error(error);
  
      // Handle other generic errors
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  
  exports.getVendorOrders = async (req, res) => {
    try {
      const { vendorId } = req.body;
  
      // Validate if vendorId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).json({ error: 'Invalid Vendor ID' });
      }
  
      // Fetch all orders for the specified vendor
      const orders = await Order.find({ vendorId }).populate('products.productId', 'name image');
  
      res.json({ orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { newStatus } = req.body;
  
      // Validate if orderId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ error: 'Invalid Order ID' });
      }
  
      // Find the order and update its status
      const order = await Order.findByIdAndUpdate(orderId, { orderStatus: newStatus }, { new: true });
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getAllProducts = async (req, res) => {
    try {
      // Fetch all products
      const products = await Product.find();
  
      res.json({ products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };