const Post = require('../models/posts.js');

exports.createPost = async (req, res, next) => {
    try {
        const { message, x, y } = req.body;

        const post = new Post({
            message: message,
            x: x,
            y: y
        });

        await post.save();

        res.status(201).json({ message: 'Post submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAllPosts = async (req, res, next) => {
    try {
        const data = await Post.find();
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch data from MongoDB', error);
        next(error);
    }
}