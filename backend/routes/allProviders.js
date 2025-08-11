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

router.get('/my-materials', async (req, res) => {
  try {
    const providerEnrolmentId = req.query.provider_enrolment_id;
    if (!providerEnrolmentId) {
      return res.status(400).json({ error: 'provider_enrolment_id is required' });
    }

    const materials = await dataPool.getMaterialsByProviderEnrolmentId(providerEnrolmentId);
    res.json(materials);
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


module.exports = router;