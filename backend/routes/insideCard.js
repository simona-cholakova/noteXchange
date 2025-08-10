const express = require("express");
const router = express.Router();
const dataPool = require('../DB/dbConn.js'); // your dataPool with DB functions

router.get('/material/:id', async (req, res) => {
  try {
    // Use the dataPool function that already fetches material + provider info
    const material = await dataPool.getStudyMaterialById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const { file, ...rest } = material;

    res.json({
      ...rest,
      hasFile: !!file,
      downloadUrl: `/api/material/${material.material_id}/download`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/material/:id/download', async (req, res) => {
  try {
    const material = await dataPool.getStudyMaterialById(req.params.id);
    if (!material || !material.file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${material.title}.pdf"`);
    res.send(material.file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
