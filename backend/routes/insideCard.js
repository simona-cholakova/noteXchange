const express = require("express");
const router = express.Router();
const dataPool = require('../DB/dbConn.js');

router.get('/materials/:id', async (req, res) => {
  try {
    const material = await dataPool.getStudyMaterialById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Send all info except raw file data
    const { file, ...rest } = material;
    res.json({
      ...rest,
      hasFile: !!file, 
      downloadUrl: `/api/materials/${material.material_id}/download`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/materials/:id/download', async (req, res) => {
  try {
    const material = await dataPool.getStudyMaterialById(req.params.id);
    if (!material || !material.file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${material.title}.pdf"`);
    res.send(material.file); // file is already stored as BLOB in DB
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

