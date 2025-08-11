const express = require('express');
const multer = require('multer');
const path = require('path');
const dataPool = require('../DB/dbConn'); 

const router = express.Router();

//setup multer storage to save files in /uploads folder with unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

//upload profile picture route
router.post('/uploads', upload.single('profilePicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const userId = req.session?.userId; 
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    //save the file path in DB, including leading /uploads/
    const imageUrl = `/uploads/${req.file.filename}`;

    //update user profile picture in DB
    await dataPool.updateUserPicture(userId, imageUrl);

    //return full relative URL to frontend
    return res.json({ url: imageUrl });
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;