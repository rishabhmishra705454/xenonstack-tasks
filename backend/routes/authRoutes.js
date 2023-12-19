const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const vendorController = require('../controllers/vendorController');
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/upload');

const router = express.Router();

// Authentication routes
router.post(
  '/user/signup',
  [
    check('name').notEmpty(),
    check('email').isEmail(),

    check('password').isLength({ min: 6 }),
    check('role').equals('user'),
  ],
  authController.userSignup
);
router.post('/user/login', authController.userLogin);

router.post(
  '/admin/signup',
  [
    check('name').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('role').equals('admin'),
  ],
  authController.adminSignup
);
router.post('/admin/login', authController.adminLogin);



router.post('/vendor/login', adminController.vendorLogin);



// Admin routes
router.post('/admin/add-vendor', authenticate, adminController.addVendor);
router.get('/get-all-vendors', authenticate, adminController.getAllVendors);
router.get('/get-all-users', authenticate, adminController.getAllUsers);

//Vendor routes

router.post('/vendor/add-product', authenticate, upload.single('image'), vendorController.addProduct);
router.get('/get-products/:vendorId', vendorController.getVendorProducts); // New route to get all products of a vendor
router.post('/get-vendors-by-category', authenticate, vendorController.getVendorsByCategory);
router.post('/create-order',authenticate , vendorController.createOrder);

router.post('/get-user-orders', authenticate, vendorController.getUserOrders);

router.post('/get-vendor-orders', authenticate, vendorController.getVendorOrders);

router.put('/update-order-status/:orderId', authenticate, vendorController.updateOrderStatus);

router.get('/get-all-products', vendorController.getAllProducts);
module.exports = router;
