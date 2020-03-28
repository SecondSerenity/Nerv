const express = require('express');
const {check, validationResult} = require('express-validator');
const ControllerAuth = require('../../controllers/ControllerAuth');

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
		return res.render('login', {layout: 'external.layout.hbs', title: 'Login', serverMessage: 'Validation error.'});
	}

	let controller = new ControllerAuth(req.app.models, req.app.config.appSecret);
	let new_session = await controller.login(req.body.login, req.body.password);
	if (!new_session) {
		return res.render('login', {layout: 'external.layout.hbs', title: 'Login', serverMessage: 'Invalid login or password.'});
	}

	res.cookie('token', new_session.token);
	res.redirect('/');
});

module.exports = router;