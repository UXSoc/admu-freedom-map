const express = require('express')
const router = express.Router()
const postsController = require('../controllers/posts');

router.post('/posts', postsController.createPost);
router.get('/posts', postsController.getAllPosts);
router.patch('/post/:id', postsController.displayPost);
router.delete('/post/:id', postsController.deletePost);

module.exports = router;