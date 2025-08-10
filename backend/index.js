const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
const datapool = require('./DB/dbConn.js');
const loginRoutes = require('./routes/login');
const cors = require('cors');
const materialsProviderRoutes = require('./routes/materialsProvider');
const materialsStudentRoutes = require('./routes/materialsStudent');
const filtersRoutes = require('./routes/filters');
const userRoutes = require('./routes/user');
const multerRoutes = require('./routes/multer');
const insideCardRoutes = require('./routes/insideCard');
const providerProfileRoutes = require('./routes/providerProfile');
const path = require('path');  
const multer = require('multer');

const port = 9333;

const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://88.200.63.148:3000',
  'http://88.200.63.148:3001',
  'http://88.200.63.148:3002',
  'http://88.200.63.148:3003',
  'http://88.200.63.148:3004',
  'http://88.200.63.148:3005',
  'http://88.200.63.148:3006',
  'http://88.200.63.148:3007',
  'http://88.200.63.148:3008'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
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
app.use('/api', materialsProviderRoutes);
app.use('/api/filters', filtersRoutes);
app.use('/api', userRoutes);
app.use('/api', multerRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', insideCardRoutes);
app.use('/api', providerProfileRoutes);


app.get('/', (req, res) => {
  res.send('hola');
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port: ${process.env.PORT || port}`);
});