const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const { Op } = require('sequelize');

const roleRequired = require('../middleware/middleware');

// Create a new post
router.post('/',roleRequired('User'), async (req, res) => {
    try {
        const { title, content, authorId } = req.body;

        // Check if the author exists
        const author = await User.findByPk(authorId);
        if (!author) {
            return res.status(400).json({ error: 'Author not found' });
        }

        // Create the post instance
        const post = Post.build({
            title,
            content,
            authorId
        });

        await post.save(); // Save the post to the database

        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all posts
router.get('/', roleRequired('User'), async (req, res) => {
    try {

        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10; 
        const offset = (page - 1) * limit;  
        const author  = req.query.author;
        const date = req.query.date;

        const queryOptions = {
            include: { model: User, as: 'author' },
            limit: limit, 
            offset: offset,
            order: [['createdAt', 'DESC']]
        };

        if (author) {
            queryOptions.where = queryOptions.where || {};
            queryOptions.where.authorId = author;
        }

        if (date) {
            queryOptions.where = queryOptions.where || {};
            queryOptions.where.createdAt = {
                [Op.eq]: new Date(date) // Assuming date is in 'YYYY-MM-DD' format
            };
        }

        const posts = await Post.findAndCountAll(queryOptions);

        const totalPosts = posts.count;
        const totalPages = Math.ceil(totalPosts / limit);

        const response = {
            totalPosts,
            totalPages,
            currentPage: page,
            posts: posts.rows.map(post => {
                const postJson = post.toJSON();
                const { authorId, ...postWithoutAuthorId } = postJson;
                return postWithoutAuthorId;
            })
        }
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single post by ID
router.get('/:id', roleRequired('User'), async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, { include: { model: User, as: 'author' } });
        if (!post) return res.status(404).json({ message: 'Post not found' });



        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a post by ID
router.put('/:id', roleRequired('User'), async (req, res) => {
    try {
        const { title, content, authorId } = req.body;
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (title) post.title = title;
        if (content) post.content = content;
        if (authorId) post.authorId = authorId;

        await post.save(); // Save the updated post

        res.json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a post by ID
router.delete('/:id', roleRequired('Admin'), async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        await post.destroy();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
