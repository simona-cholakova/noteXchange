const express = require('express');
const router = express.Router();
const dataPool = require('../DB/dbConn');

router.get('/providers/:enrolment_id', async (req, res) => {
  try {
    const provider = await dataPool.getProviderByEnrolmentId(req.params.enrolment_id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    res.json(provider);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;