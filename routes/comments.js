const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {check, validationResult} = require('express-validator');

router.get('/', async (req, res) => {
	try {
		res.send('Comments are bae');
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
