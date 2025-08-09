const express = require('express');
const router = express.Router();
const dataPool = require('../DB/dbConn');

router.get('/userData', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const user = await dataPool.getUserById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure picture_url includes /uploads prefix if needed
    if (user.picture_url && !user.picture_url.startsWith('/uploads')) {
      user.picture_url = '/uploads/' + user.picture_url;
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/user/updatePicture', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const { pictureUrl } = req.body;
  if (!pictureUrl) {
    return res.status(400).json({ error: 'No picture URL provided' });
  }

  try {
    await dataPool.updateUserPicture(req.session.userId, pictureUrl);
    res.json({ message: 'Profile picture updated' });
  } catch (err) {
    console.error('Error updating picture URL:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
