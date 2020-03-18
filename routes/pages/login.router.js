const express = require('express');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const EntitySession = require('../../models/auth/EntitySession');

let router = express.Router();

router.get('/', (req, res) => {
	if (req.session) {
		// user is already logged in
		return res.redirect('/');
	}

	res.render('login', {layout: 'external.layout.hbs', title: 'Login'});
});

let login_params = [
    check('login').exists().isLength({min: 1}),
    check('password').exists().isLength({min: 1})
];
router.post('/', login_params, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render('login', {layout: 'external.layout.hbs', title: 'Login', serverMessage: 'Validation error.'});
		return;
	}

	let users = req.app.models.get('ModelUser');
	let user = await users.getUserByLogin(req.body.login);
	if (user === null || !user.checkPassword(req.body.password)) {
		res.render('login', {layout: 'external.layout.hbs', title: 'Login', serverMessage: 'Invalid login or password.'});
		return;
	}

	let session = new EntitySession(0, user.id, '');
	session.randomizeRefreshToken();
	let sessions = req.app.models.get('ModelSession');
	await sessions.createSession(session);

	let token = jwt.sign({jti: session.jti}, req.app.config.appSecret, {
		expiresIn: 86400 // expires in 24 hours
	});

	res.cookie('token', token);
	res.redirect('/');
});

module.exports = router;