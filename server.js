const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const dbUser = process.env.MONGODB_USER;
const dbPass = process.env.MONGODB_PASS;

const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth'); // Import auth routes

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@admu-freedom-map.kfrcb.mongodb.net/?retryWrites=true&w=majority&appName=admu-freedom-map`)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', postRoutes);
app.use('/api/auth', authRoutes); // Add auth routes

app.use(function (err, req, res, next) {
    res.status(422).send({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use(express.static('public'));