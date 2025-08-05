const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
const datapool = require('./DB/dbConn.js');
const loginRoutes = require('./routes/login'); 
const cors = require('cors');

const port = 9333;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://88.200.63.148:3000',
  credentials: true
}));

app.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } //true if using HTTPS
}));

// Routes
app.use('/api', loginRoutes); 

app.get('/', (req, res) => {
  res.send('hola');
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port: ${process.env.PORT || port}`);
});
