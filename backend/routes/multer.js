const express = require('express');
const multer = require('multer');
const path = require('path');
const dataPool = require('../DB/dbConn'); // Adjust the path accordingly

const router = express.Router();

// Setup multer storage to save files in /uploads folder with original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // relative to your project root
  },
  filename: (req, file, cb) => {
    // Use a timestamp + original name to avoid name collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Make /uploads folder static so images can be served directly
router.use('/upload', express.static(path.join(__dirname, 'uploads')));

// Upload profile picture route
router.post('/uploads', upload.single('profilePicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const userId = req.session?.userId; // Assuming you store logged-in userId in session
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Save the file path (relative URL) in DB
    const imageUrl = `/uploads/${req.file.filename}`;

    // Assuming you have a method in dataPool to update user profile picture URL
    await dataPool.updateUserProfilePicture(userId, imageUrl);

    return res.json({ url: imageUrl });
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
