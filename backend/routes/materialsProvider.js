const express = require('express');
const router = express.Router();
const multer = require('multer');
const dataPool = require('../DB/dbConn');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/publish', upload.single('file'), (req, res) => {
  try {
    const { title, description, provider_enrolment_id, provider_name, provider_surname, type, academic_year, study_program, university, course } = req.body;
    const fileBuffer = req.file?.buffer;

    if (!fileBuffer) {
      return res.status(400).json({ error: 'File is required.' });
    }

    dataPool.publishStudyMaterial(
      title, description, provider_enrolment_id, provider_name, provider_surname, fileBuffer, type, academic_year, study_program, university, course
    )
      .then(result => {
        res.status(201).json({ message: 'Material published successfully!', id: result.insertId });
      })
      .catch(err => {
        console.error('Error publishing material:', err);
        res.status(500).json({ error: 'Failed to publish material.' });
      });
  } catch (err) {
    console.error('Unexpected error in /publish:', err);
    res.status(500).json({ error: 'Server crashed inside /publish.' });
  }
});

router.delete('/study-material/:material_id', async (req, res) => {
  const materialId = req.params.material_id;

  try {
    const result = await dataPool.deleteStudyMaterialById(materialId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Study material not found' });
    }

    res.json({ message: 'Study material deleted successfully' });
  } catch (error) {
    console.error('Error deleting study material:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;