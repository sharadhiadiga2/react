const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const { nanoid } = require('nanoid'); // This line is correct as is, but depends on the installed version
const path = require('path');

const Product = require('../models/Product');

// Multer Configuration for Image Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// @route   POST api/products
// @desc    Add new product
router.post('/', [auth, upload.single('image')], async (req, res) => {
  const { name, description, cost, procedureEnabled } = req.body;
  const procedure = JSON.parse(req.body.procedure);

  if (!name || !cost) {
    return res.status(400).json({ msg: 'Please provide a name and cost' });
  }

  try {
    const productId = `SKU-${nanoid(8).toUpperCase()}`;

    const newProduct = new Product({
      name,
      productId,
      description,
      cost,
      procedure,
      procedureEnabled,
      imageUrl: req.file ? req.file.path.replace(/\\/g, "/") : '',
      user: req.user.id,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products
// @desc    Get all user's products
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({ date: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/public
// @desc    Get all products (public listing)
router.get('/public', async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/custom-orders
// @desc    Get custom orders as public products
router.get('/custom-orders', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const customOrders = await Order.find({ 
      'items.custom': { $exists: true },
      status: { $in: ['placed', 'reviewed_by_sales', 'user_confirmed'] }
    }).populate('user', 'name').sort({ createdAt: -1 });
    
    // Convert custom orders to product-like format
    const customProducts = customOrders.map(order => ({
      _id: order._id,
      name: order.items[0].custom.name,
      description: order.items[0].custom.description,
      cost: order.items[0].custom.unitPrice,
      imageUrl: order.items[0].custom.imageUrl || 'uploads/image-1760161216976.png',
      productId: `CUSTOM-${order._id.toString().slice(-6)}`,
      isCustom: true,
      orderDetails: {
        color: order.items[0].custom.color,
        finish: order.items[0].custom.finish,
        background: order.items[0].custom.background,
        size: order.items[0].custom.size,
        quantity: order.items[0].quantity,
        customer: order.user.name
      }
    }));
    
    res.json(customProducts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/public/:id
// @desc    Get single product (public)
router.get('/public/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/products/:id
// @desc    Update product
router.put('/:id', auth, async (req, res) => {
    const { name, description, cost, procedure, procedureEnabled } = req.body;
    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (cost) productFields.cost = cost;
    if (procedure) productFields.procedure = procedure;
    if (procedureEnabled !== undefined) productFields.procedureEnabled = procedureEnabled;

    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        product = await Product.findByIdAndUpdate(req.params.id, { $set: productFields }, { new: true });
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/products/:id
// @desc    Delete product
router.delete('/:id', auth, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        await Product.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;