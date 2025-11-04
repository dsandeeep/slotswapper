const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// GET /api/slots/swappable - Get all swappable slots (excluding user's own)
router.get('/swappable', auth, async (req, res) => {
  try {
    const slots = await Event.find({
      status: 'SWAPPABLE',
      userId: { $ne: req.user.userId }
    }).populate('userId', 'name email');
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
