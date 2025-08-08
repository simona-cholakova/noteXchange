const express = require('express');
const router = express.Router();
const dataPool = require('../DB/dbConn');

router.get('/userData', async (req, res) => {
  // Check if user info exists in session
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const enrolment_id = req.session.user.enrolment_id;

    if (!enrolment_id) {
      return res.status(400).json({ error: 'Enrolment ID missing in session' });
    }

    // Fetch user info by enrolment_id from DB
    const user = await dataPool.getUserById(enrolment_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
