const pool = require('../utls/pool');
const colors = require('colors');

const connectDB = async () => {
	try {
		pool;

		console.log(`Postgres is running, good job Will! So freaking cool!`.magenta.bold);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

module.exports = connectDB;
