const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');

(async () => {
  try {
    await connectDB();
    const samples = [
      {
        name: 'Red/White Glossy Bottle Stickers',
        description: 'Hot stickers with glossy finish for bottles. Vibrant red and white, transparent background available.',
        cost: 10,
        imageUrl: 'uploads/image-1760161216976.png',
      },
      {
        name: 'Matte Laptop Stickers',
        description: 'Durable matte finish stickers for laptops. Custom shapes and sizes.',
        cost: 10,
        imageUrl: 'uploads/image-1760167002497.png',
      },
      {
        name: 'Clear Transparent Decals',
        description: 'Crystal clear decals perfect for glass and smooth surfaces.',
        cost: 10,
        imageUrl: 'uploads/image-1760161216976.png',
      },
    ];

    // Create a dummy owner if needed
    const anyExisting = await Product.findOne();
    const owner = anyExisting?.user || new mongoose.Types.ObjectId();

    for (const s of samples) {
      const exists = await Product.findOne({ name: s.name });
      if (exists) continue;
      const productId = `SKU-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      await Product.create({
        user: owner,
        name: s.name,
        productId,
        description: s.description,
        cost: s.cost,
        procedure: [],
        procedureEnabled: true,
        imageUrl: s.imageUrl,
      });
    }
    console.log('Sticker products seeded.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();


