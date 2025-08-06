const express = require('express');
const router = express.Router();
const datapool = require('../DB/dbConn'); 

// Get all study materials
router.get('/all', (req, res) => {
  datapool.getAllStudyMaterials()
    .then(materials => {
      res.status(200).json(materials);
    })
    .catch(err => {
      console.error('Error fetching materials:', err);
      res.status(500).json({ error: 'Failed to fetch materials.' });
    });
});


