const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');

// POST /api/swaps/request - Create swap request
router.post('/request', auth, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    
    const mySlot = await Event.findOne({ 
      _id: mySlotId, 
      userId: req.user.userId, 
      status: 'SWAPPABLE' 
    });
    
    const theirSlot = await Event.findOne({ 
      _id: theirSlotId, 
      status: 'SWAPPABLE' 
    });

    if (!mySlot || !theirSlot) {
      return res.status(400).json({ message: 'Invalid slots' });
    }

    const swapRequest = new SwapRequest({
      mySlotId,
      theirSlotId,
      myUserId: req.user.userId,
      theirUserId: theirSlot.userId,
      status: 'PENDING'
    });

    await swapRequest.save();
    
    mySlot.status = 'SWAPPENDING';
    theirSlot.status = 'SWAPPENDING';
    await mySlot.save();
    await theirSlot.save();

    res.json(swapRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/swaps/incoming - Get incoming swap requests
router.get('/incoming', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      theirUserId: req.user.userId,
      status: 'PENDING'
    }).populate('mySlotId theirSlotId myUserId');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/swaps/outgoing - Get outgoing swap requests
router.get('/outgoing', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      myUserId: req.user.userId
    }).populate('mySlotId theirSlotId theirUserId');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/swaps/respond - Accept or reject swap
router.post('/respond', auth, async (req, res) => {
  try {
    const { requestId, action } = req.body;
    
    const swapRequest = await SwapRequest.findOne({
      _id: requestId,
      theirUserId: req.user.userId
    });

    if (!swapRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (action === 'ACCEPT') {
      swapRequest.status = 'ACCEPTED';
      
      const mySlot = await Event.findById(swapRequest.mySlotId);
      const theirSlot = await Event.findById(swapRequest.theirSlotId);
      
      const tempUserId = mySlot.userId;
      mySlot.userId = theirSlot.userId;
      theirSlot.userId = tempUserId;
      
      mySlot.status = 'BUSY';
      theirSlot.status = 'BUSY';
      
      await mySlot.save();
      await theirSlot.save();
    } else {
      swapRequest.status = 'REJECTED';
      
      await Event.findByIdAndUpdate(swapRequest.mySlotId, { status: 'SWAPPABLE' });
      await Event.findByIdAndUpdate(swapRequest.theirSlotId, { status: 'SWAPPABLE' });
    }

    await swapRequest.save();
    res.json(swapRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
