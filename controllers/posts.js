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
        res.status(500).send(error);
    }
}

exports.displayPost = async (req, res, next) => {
    try {
        const food = await Post.findByIdAndUpdate(req.params.id, {
            'isPosted': true
        });
        if (!food)
            res.status(404).send('Post not found');

        res.status(201).json({ message: 'Post posted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const food = await Post.findByIdAndDelete(req.params.id);

        if (!food)
                res.status(404).send('Post not found');
        res.status(201).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
}