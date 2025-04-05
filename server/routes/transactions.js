const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @route   POST api/transactions/topup
// @desc    Top up balance
// @access  Private
router.post('/topup', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    const transaction = new Transaction({
      user: req.user.id,
      type: 'topup',
      amount,
      paymentMethod,
    });

    await transaction.save();

    // Update user balance
    const user = await User.findById(req.user.id);
    user.balance += amount;
    await user.save();

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/transactions/purchase
// @desc    Purchase products
// @access  Private
router.post('/purchase', auth, async (req, res) => {
  try {
    const { products } = req.body;
    const user = await User.findById(req.user.id);
    
    // Calculate total amount
    const totalAmount = products.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Check if user has enough balance
    if (user.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      user: req.user.id,
      type: 'purchase',
      amount: totalAmount,
      products,
      status: 'completed',
    });

    await transaction.save();

    // Update user balance
    user.balance -= totalAmount;
    await user.save();

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/transactions
// @desc    Get user transactions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 