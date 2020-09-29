const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {check, validationResult} = require('express-validator');

//  @ Route     GET /api/comments/
//  @ Desc      Get all comments
//  @ Access    Public
router.get('/', async (req, res) => {
	try {
		const comments = pool.query(`SELECT * FROM comments`);

		res.json({success: true, count: (await comments).rowCount, comments: (await comments).rows});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

//  @ Route     GET /api/comments/user/:creator
//  @ Desc      Get all comments by creator ID
//  @ Access    Public
router.get('/user/:creator', async (req, res) => {
	try {
		const comments = pool.query(`SELECT * FROM comments WHERE creator_id = ${req.params.creator}`);

		res.json({success: true, count: (await comments).rowCount, comments: (await comments).rows});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

//  @ Route     GET /api/comments/post/:postid
//  @ Desc      Get all comments by post ID
//  @ Access    Public
router.get('/post/:postid', async (req, res) => {
	try {
		const comments = pool.query(`SELECT * FROM comments WHERE post_id = ${req.params.postid}`);

		res.json({success: true, count: (await comments).rowCount, comments: (await comments).rows});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

//  @ Route     POST /api/comments/:creatorid/:postid
//  @ Desc      Create comment
//  @ Access    Public
router.post('/:creatorid/:postid', [check('message', 'Message is required').not().isEmpty()], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({success: false, errors: errors.array()});
	}

	const {message} = req.body;

	try {
		let comment = pool.query(`INSERT INTO comments (message, post_id, creator_id) VALUES ($1, $2, $3)`, [message, req.params.postid, req.params.creatorid]);

		res.status(201).json({success: true, msg: 'Post created!'});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
