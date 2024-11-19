const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    message: String,
    x: Number,
    y: Number,
    isPosted: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('Post', PostSchema);