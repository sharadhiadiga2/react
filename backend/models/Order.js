const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
      // When ordering without predefined product
      custom: {
        name: { type: String },
        description: { type: String },
        color: { type: String },
        finish: { type: String },
        background: { type: String },
        size: { type: String },
        unitPrice: { type: Number },
        imageUrl: { type: String },
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  status: {
    type: String,
    enum: ['placed', 'reviewed_by_sales', 'user_confirmed', 'sent_to_production'],
    default: 'placed',
  },
  notes: { type: String },
  salesReviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  reviewComment: { type: String },
  reviewedBy: { type: String },
  reviewedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

OrderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('order', OrderSchema);


