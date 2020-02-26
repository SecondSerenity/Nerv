const express = require('express');
const {check, validationResult} = require('express-validator');

let router = express.Router();

router.get('/', (req, res) => {
	res.render('login', {title: 'Login'});
});

let login_params = [
    check('login').exists().isLength({min: 1}),
    check('password').exists().isLength({min: 1})
];
router.post('/', login_params, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render('login', {title: 'Login', serverMessage: 'Validation error.'});
		return;
	}

	let model = req.app.models.get('ModelUser');
	let user = await model.getUserByLogin(req.body.login);
	if (user === null || !user.checkPassword(req.body.password)) {
		res.render('login', {title: 'Login', serverMessage: 'Invalid login or password.'});
		return;
	}

	res.send('success!');
});

module.exports = router;