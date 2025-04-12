// backend/routes/posts.js
const express = require('express');
const router = express.Router();

// Example: GET /api/posts - Retrieve posts
router.get('/', (req, res) => {
  res.send('Posts route is working!');
});

module.exports = router;



/*
// routes/posts.js
const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware'); // see Step 6 below

const router = express.Router();

// CREATE a new post (Protected)
router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = new Post({
      title,
      content,
      user: req.user,  // req.user is set by the authMiddleware
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// READ all posts (Public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name email');
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// UPDATE a post (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Ensure that the user owns the post
    if (post.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE a post (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Check ownership
    if (post.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

*/