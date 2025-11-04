const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    console.log('📝 Signup request received');
    console.log('Request body:', req.body);
    
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user exists
    console.log('🔍 Checking if user exists...');
    let user = await User.findOne({ email });
    if (user) {
      console.log('❌ User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log('👤 Creating new user...');
    user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log('✅ User created successfully');

    // Generate token
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: '7d' }
    );

    console.log('✅ Signup successful');
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });

  } catch (err) {
    console.error('❌ SIGNUP ERROR:', err);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    console.log('🔑 Login request received');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful');
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });

  } catch (err) {
    console.error('❌ LOGIN ERROR:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
});

module.exports = router;
