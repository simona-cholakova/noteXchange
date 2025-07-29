const express = require("express")
const login = express.Router();
const datapool = require('../DB/dbConn.js');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { enrolment_id, password } = req.body;

    try {
        const user = await datapool.login(enrolment_id, password);
        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
});

router.post('/register', async (req, res) => {
    const { enrolment_id, name, surname, email, username, password } = req.body;

    if (!enrolment_id || !name || !surname || !email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await datapool.register(enrolment_id, name, surname, email, username, password);
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await datapool.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
});


module.exports = router;


