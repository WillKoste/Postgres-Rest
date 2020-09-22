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

//  @ Route     GET /api/posts/user/:creatorid/:postid
//  @ Desc      Get post by CreatorID, specified with PostID
//  @ Access    Public
router.get('/user/:creatorid/:postid', async (req, res) => {
	try {
		// const post = await pool.query(`SELECT * FROM users u INNER JOIN posts p ON u.id = u.creatorid`)
		const post = await pool.query(`SELECT * FROM posts p WHERE creatorid = ${req.params.creatorid} AND id = ${req.params.postid}`);
		// const post = await pool.query(`SELECT * FROM posts p WHERE creatorid = $1 AND id = $2`, [req.params.creatorid, req.params.postid]);

		if (post.rowCount === 0) {
			return res.status(404).json({success: false, msg: `No post found from the author with the creator ID of ${req.params.creatorid} with id ${req.params.postid}`});
		}

		res.json({success: true, post: post.rows});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

//  @ Route     POST /api/posts/:creatorid
//  @ Desc      Create post
//  @ Access    Public
router.post('/:creatorid', [check('title', 'Post title is required').not().isEmpty(), check('body', 'Post body is required').not().isEmpty()], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({success: false, errors: errors.array()});
	}

	const {title, body} = req.body;

	try {
		let post = await pool.query(`INSERT INTO posts (title, body, creatorid) VALUES ($1, $2, $3)`, [title, body, req.params.creatorid]);

		res.status(201).json({success: true, msg: 'Post created!'});
	} catch (err) {
		if (err.code === '23503') {
			return res.status(400).json({success: false, msg: `No user could be found with the id of ${req.params.creatorid}. Please use a valid ID.`});
		}

		console.error(err);
		res.status(400).json({success: false, msg: 'Unable to complete request, please try again or contact page support.'});
	}
});

//  @ Route     PUT /api/posts/post/:postid
//  @ Desc      Update post by post ID
//  @ Access    Public
router.put('/post/:postid', [check('title', 'Post title is required').not().isEmpty(), check('body', 'Post body is required').not().isEmpty()], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({success: false, errors: errors.array()});
	}

	const {title, body} = req.body;

	try {
		const post = pool.query(`UPDATE POSTS SET title = $1, body = $2 WHERE id = ${req.params.postid}`, [title, body]);

		res.json({success: true, msg: `Post ${req.params.postid} had been updated.`});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

//  @ Route     DELETE /api/posts/post/:postid
//  @ Desc      Delete post by Post ID
//  @ Access    Public
router.delete('/post/:postid', async (req, res) => {
	try {
		const post = await pool.query(`DELETE FROM posts WHERE id = ${req.params.postid}`);

		res.json({success: true, msg: `Post ${req.params.postid} has been deleted.`});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
