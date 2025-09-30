const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-board', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err =>console.log(err));

// basiceoute for testing
app.get('/', (req, res) => {
    res.json({ message: 'Api is working' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

//test route
app.get('/api/test', (req, res) => {
    res.send('Job Board API is running.....');
});
app.use('/api/jobs', require('./routes/Jobs'));

app.use(cors({
    origin: [
        'http://localhost:3000',
    'https://jobboard-frontend.netlify.app'
    ],
    credentials: true
    }));