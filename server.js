const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const registrationSchema = new mongoose.Schema({}, { strict: false });
const Registration = mongoose.model('Registration', registrationSchema);

app.post('/register', async (req, res) => {
  try {
    const newEntry = new Registration(req.body);
    await newEntry.save();
    res.status(201).json({ message: 'Registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.use('/downloads', express.static(path.join(__dirname, 'exports')));

app.get('/', (req, res) => {
  res.send('Marathon Registration API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
