const express = require('express');
const router = express.Router();
const dataPool = require('../DB/dbConn'); 

router.get('/course', async (req, res) => {
  try {
    const name = req.query.name;
    const results = await dataPool.searchByCourse(name);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/university', async (req, res) => {
  try {
    const name = req.query.name;
    const results = await dataPool.searchByUniversity(name);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/provider', async (req, res) => {
  try {
    const name = req.query.name;
    const results = await dataPool.searchByProvider(name);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/year', async (req, res) => {
  try {
    const year = req.query.year;
    const results = await dataPool.searchByYear(year);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/program', async (req, res) => {
  try {
    const program = req.query.name;
    const results = await dataPool.searchByStudyProgram(program);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
