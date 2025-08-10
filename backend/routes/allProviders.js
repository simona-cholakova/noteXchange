const express = require('express');
const router = express.Router();
const dataPool = require('../DB/dbConn');

router.get('/allProviders', async (req, res) => {
  try {
    const providers = await dataPool.getAllProviders();
    res.status(200).json(providers);
  } catch (err) {
    console.error('Error fetching providers:', err);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});


module.exports = router;