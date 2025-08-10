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

router.post('/updateAboutMe', async (req, res) => {
  const { about_me } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  if (typeof about_me !== 'string') {
    return res.status(400).json({ error: 'Invalid about_me value' });
  }

  try {
    await dataPool.updateAboutMe(userId, about_me);
    res.json({ success: true, about_me });
  } catch (err) {
    console.error('Error updating about_me:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


module.exports = router;
