exports.get404 = (req, res, next) => {
	res.status(404).send('<h2>Page Not Found</h2>');
}