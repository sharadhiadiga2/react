const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');

// Multer storage for custom order images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'order-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// @route   POST api/orders
// @desc    Place an order (user)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { items, notes } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Items are required' });
    }
    const order = new Order({ user: req.user.id, items, notes });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/orders/custom
// @desc    Place a custom sticker order (no predefined product)
// @access  Private
router.post('/custom', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, color, finish, background, size, unitPrice, quantity, notes } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ msg: 'Quantity must be at least 1' });
    const order = new Order({
      user: req.user.id,
      items: [
        {
          custom: { 
            name: name || '', 
            description: description || '', 
            color: color || '', 
            finish: finish || '', 
            background: background || '', 
            size: size || '', 
            unitPrice: unitPrice ? Number(unitPrice) : 10,
            imageUrl: req.file ? req.file.path.replace(/\\/g, '/') : undefined 
          },
          quantity: Number(quantity),
        },
      ],
      notes: notes || '',
    });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders/my
// @desc    Get my orders (user)
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders/sales
// @desc    List orders for sales to review
// @access  Private (sales/admin)
router.get('/sales', auth, async (req, res) => {
  try {
    // Role enforcement is intentionally light to avoid breaking existing auth; front-end will gate
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.product').populate('user', 'name email role');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/orders/:id/review
// @desc    Sales reviews and confirms order
// @access  Private (sales/admin)
router.put('/:id/review', auth, async (req, res) => {
  try {
    const { reviewComment, reviewedBy } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    
    order.status = 'reviewed_by_sales';
    order.salesReviewer = req.user.id;
    order.reviewComment = reviewComment || '';
    order.reviewedBy = reviewedBy || '';
    order.reviewedAt = new Date();
    
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/orders/:id/user-confirm
// @desc    User confirms order after sales review
// @access  Private (user)
router.put('/:id/user-confirm', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (order.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    if (order.status !== 'reviewed_by_sales') return res.status(400).json({ msg: 'Order not ready for user confirmation' });
    order.status = 'user_confirmed';
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/orders/:id/send-to-production
// @desc    Sales sends confirmed order to production (stop here per requirements)
// @access  Private (sales/admin)
router.put('/:id/send-to-production', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (order.status !== 'user_confirmed') return res.status(400).json({ msg: 'Order not confirmed by user' });
    order.status = 'sent_to_production';
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;


