const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

// Serve Static Files from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('API Running'));

// Debug route to test token validation
app.post('/debug-token', (req, res) => {
  const token = req.header('x-auth-token');
  console.log('Received token:', token);
  
  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    res.json({ 
      success: true, 
      decoded: decoded,
      message: 'Token is valid' 
    });
  } catch (err) {
    console.error('Token validation error:', err.message);
    res.status(401).json({ 
      msg: 'Token is not valid', 
      error: err.message 
    });
  }
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));