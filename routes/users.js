const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {check, validationResult} = require('express-validator');

router.get('/', async (req, res) => {
	try {
		const books = await pool.query(`SELECT * FROM users`);

		res.json({
			success: true,
			count: books.rowCount,
			users: books.rows
		});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

router.get('/:id', async (req, res) => {
	try {
		const user = await pool.query(`SELECT * FROM users WHERE id = ${req.params.id}`);

		if (user.rowCount === 0) {
			return res.status(404).json({success: false, msg: `No user found with the id of ${req.params.id}`});
		}

		res.json({success: true, user: user.rows[0]});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

router.post('/', [check('firstName').not().isEmpty(), check('email').isEmail()], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({success: false, errors: errors.array()});
	}

	const {firstName, lastName, age, email, hobby, job} = req.body;

	try {
		let user = await pool.query(`INSERT INTO users (firstName, lastName, age, email, hobby, job) VALUES ($1, $2, $3, $4, $5, $6)`, [firstName, lastName, age, email, hobby, job]);

		res.status(201).json({success: true, user});
	} catch (err) {
		console.error(err);
		res.status(400).json({success: false, msg: 'Bad request, please try again'});
	}
});

router.put('/:id', async (req, res) => {
	const {firstName, lastName, age, email, hobby, job} = req.body;

	try {
		const updateUser = await pool.query(`UPDATE users SET firstName = $1, lastName = $2, age = $3, email = $4, hobby = $5, job = $6 WHERE id = ${req.params.id}`, [firstName, lastName, age, email, hobby, job]);

		res.json({success: true, msg: `User ${req.params.id} has been updated!`});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const user = await pool.query(`DELETE FROM users WHERE id = ${req.params.id}`);

		if (user.rowCount === 0) {
			return res.status(404).json({success: false, msg: `No user found with the id of ${req.params.id}`});
		}

		res.status(200).json({success: true, msg: `User ${req.params.id} has been deleted!`});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
