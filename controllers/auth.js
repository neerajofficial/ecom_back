const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./../models/user');

exports.signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorObj('Validation Failed', 422, errors.array());

	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;

	const hashed = await bcrypt.hash(password, 12);
	if (!hashed) return errorObj('Error in saving', 500);
	
	const user = new User({
		username: username,
		email: email,
		password: hashed
	});

	const created = await user.save();
	if (!created) return errorObj('Error in saving', 500);
	res.status(201).json({
		message: 'User Created',
		user_id: created._id
	})
}

exports.login = async (req, res, next) => {	
	const username = req.body.username;
	const password = req.body.password;
	const user = await User.findOne({ username: username});
	if (!user) return errorObj('Invalid email', 401);
	const authPassword = await bcrypt.compare(password, user.password);
	if (!authPassword) return errorObj('Invalid Password', 401);

	const token = await jwt.sign(
		{
			email: user.email, 
			userId: user._id.toString()
		}, 
		'SECRET', 
		{ expiresIn: '1h'}
	);

	res.status(200).json({
		token: token,
		user_id: user._id.toString()
	})

}

const errorObj = (message, code, data) => {
	const error = new Error(message);
	error.statusCode = code;
	throw error;
}