const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

	let decodedToken;

	try {
		decodedToken = jwt.verify(token, 'secret');
	} catch (err) {
		const error = new Error('Not Authorized');
		err.statusCode = 401;
		throw err;
	}
	if (!decodedToken) {
		const error = new Error('Not Authorized');
		error.statusCode = 401;
		throw error;
	}

	req.user_id = decodedToken.userId;
	next();
}