const express = require('express');
const app = express();
require('dotenv').config();

const datapool = require('./DB/dbConn.js');
const loginRoutes = require('./routes/login'); 

const port = 9333;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', loginRoutes); 

app.get('/', (req, res) => {
  res.send('hola');
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port: ${process.env.PORT || port}`);
});
