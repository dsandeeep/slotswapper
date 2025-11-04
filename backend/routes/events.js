const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// GET /api/events - Get user's events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.userId });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/events - Create event
router.post('/', auth, async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    const event = new Event({
      title,
      startTime,
      endTime,
      status: 'BUSY',
      userId: req.user.userId
    });
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/events/:id - Update event
router.patch('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Event.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
