const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});
const morgan = require('morgan');
const helmet = require('helmet');
const colors = require('colors');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/friends', require('./routes/friends'));

app.use(helmet());

const port = process.env.PORT || 5000;
const mode = process.env.NODE_ENV || 'Default';

app.listen(port, () => {
	console.log(`Express server running on port ${port}, in ${mode} mode`.cyan.underline.bold);
});
