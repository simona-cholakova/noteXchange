const express = require('express');
const router = express.Router();
const multer = require('multer');
const datapool = require('../DB/dbConn');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/publish', upload.single('file'), (req, res) => {
  try {
    const { title, description, provider_enrolment_id, provider_name, provider_surname, type, academic_year, study_program, university, course } = req.body;
    const fileBuffer = req.file?.buffer;

    if (!fileBuffer) {
      return res.status(400).json({ error: 'File is required.' });
    }

    datapool.publishStudyMaterial(
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



module.exports = router;