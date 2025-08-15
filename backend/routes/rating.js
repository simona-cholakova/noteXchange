const express = require('express');
const router = express.Router();
const dataPool = require('../DB/dbConn');

// ADD RATING
router.post('/ratings', async (req, res) => {
  const { user_id, material_id, rating_value, comment } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  if (!material_id || rating_value == null) {
    return res.status(400).json({ error: 'Material ID and rating value are required' });
  }

  try {
    // Use the user_id from the request body, not from session
    const result = await dataPool.addRating(user_id, material_id, rating_value, comment || null);
    res.status(201).json({ message: 'Rating added successfully', ratingId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add rating', details: err.message });
  }
});

router.get('/my-ratings', async (req, res) => {
  const enrolmentId = req.session.userId; // get logged-in user ID

  if (!enrolmentId) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const data = await dataPool.getMyRatings(enrolmentId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;