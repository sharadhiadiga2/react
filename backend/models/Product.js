const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  name: { type: String, required: true },
  productId: { type: String, required: true, unique: true },
  description: { type: String },
  cost: { type: Number, required: true },
  procedure: [{ type: String }], // Stored as an array of steps
  procedureEnabled: { type: Boolean, default: true },
  imageUrl: { type: String },
  date: { type: Date, default: Date.now },
});

ProductSchema.index({ productId: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('product', ProductSchema);