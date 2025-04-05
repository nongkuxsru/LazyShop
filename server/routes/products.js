const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getProducts);

// @route   GET api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', productController.getProduct);

// @route   POST api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', auth, productController.createProduct);

// @route   PUT api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', auth, productController.updateProduct);

// @route   DELETE api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router; 