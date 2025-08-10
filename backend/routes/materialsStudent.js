const express = require('express');
const router = express.Router();
const dataPool = require('../DB/dbConn'); 

// Get all study materials
router.get('/studymaterials', async (req, res) => {
  try {
    const materials = await dataPool.getAllStudyMaterials();
    res.json(materials);
  } catch (err) {
    console.error('Error fetching study materials:', err);
    res.status(500).json({ error: 'Failed to fetch study materials' });
  }
});

module.exports = router;

