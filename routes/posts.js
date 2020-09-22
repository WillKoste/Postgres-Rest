const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {check, validationResult} = require('express-validator');

//  @ Route     GET /api/posts/
//  @ Desc      Get all posts
//  @ Access    Public
router.get('/', async (req, res) => {
	try {
		const posts = await pool.query('SELECT * FROM posts');

		res.json({succuess: true, count: posts.rowCount, posts: posts.rows});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

//  @ Route     GET /api/posts/post/:postid
//  @ Desc      Get post by PostID
//  @ Access    Public
router.get('/post/:id', async (req, res) => {
	try {
		const post = await pool.query(`SELECT * FROM posts WHERE id = ${req.params.id}`);

		if (post.rowCount === 0) {
			return res.status(404).json({success: false, msg: `No posts found with the ID of ${req.params.id}`});
		}

		res.json({success: true, post: post.rows});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

//  @ Route     GET /api/posts/user/:creatorid
//  @ Desc      Get post(s) by CreatorID
//  @ Access    Public
router.get('/user/:creatorid', async (req, res) => {
	try {
		const post = await pool.query(`SELECT * FROM posts WHERE creatorid = ${req.params.creatorid}`);

		if (post.rowCount === 0) {
			return res.status(404).json({success: false, msg: `No posts found from the author with the creator ID of ${req.params.creatorid}`});
		}

		res.json({success: true, count: post.rowCount, post: post.rows});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

//  @ Route     POST /api/posts/
//  @ Desc      Create Post
//  @ Access    Public
router.post('/:postid/:authorid', async (req, res) => {
	try {
		let post = await pool.query(`SELECT `);
	} catch (err) {
		console.error(err);
		res.status(400).json({success: false, msg: 'Unable to complete request, please try again or contact page support.'});
	}
});

module.exports = router;
