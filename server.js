const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const dbUser = process.env.MONGODB_USER;
const dbPass = process.env.MONGODB_PASS;

const routes = require('./routes/posts');

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@admu-freedom-map.kfrcb.mongodb.net/?retryWrites=true&w=majority&appName=admu-freedom-map`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(function (err, req, res, next) {
    res.status(422).send({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

app.use(express.static('public'));

