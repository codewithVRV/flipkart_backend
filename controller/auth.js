const User = require('../model/user');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
	console.log(req.body)
	const username = req.body.username;
	const password = req.body.password;
	if (username && password) {
		User.findOne({
			username: username,
			password: password,
		})
			.then((user) => {
				if (user) {
					const t=jwt.sign({ user: username, id: user.id }, 'secret_key');

					return res.cookie('jwt-token', t, {
						httpOnly: true,
						maxAge: 3600000, // 1 hour expiration time (in milliseconds)
					}).json({
						token: t,
					});
				} else {
					res.status(401);
					return res.send('username or password is incorrect');
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
};
