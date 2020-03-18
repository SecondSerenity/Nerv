const express = require('express');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const EntityUser = require('../../models/user/EntityUser');
const EntitySession = require('../../models/auth/EntitySession');

let router = express.Router();

router.get('/', (req, res) => {
	if (req.session) {
        // user is already registered
		return res.redirect('/');
	}

	res.render('register', {layout: 'external.layout.hbs', title: 'Register'});
});

let register_params = [
    check('pin_code').exists().isLength({min: 1}),
    check('username').exists().isLength({min: 1}),
    check('email').isEmail(),
    check('password').exists().isLength({min: 8, max: 50})
];
router.post('/', register_params, async(req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		returnErrorResponse(res, req.body, 'Validation error.');
		return;
    }
    
    let invites = req.app.models.get('ModelInvite');
    let invite = await invites.getActiveInvite(req.body.pin_code);
    if (null === invite) {
        returnErrorResponse(res, req.body, 'Invalid pin code.');
		return;
    }

    let users = req.app.models.get('ModelUser');
    let user = await users.getUserByLogin(req.body.username);
    if (null !== user) {
        returnErrorResponse(res, req.body, 'Username already taken.');
		return;
    }

    user = await users.getUserByLogin(req.body.email);
    if (null !== user) {
        returnErrorResponse(res, req.body, 'Email already taken.');
		return;
    }

    await invites.deleteInvite(invite.id);
    let new_user = new EntityUser(0, req.body.username, req.body.email, '');
    new_user.setPassword(req.body.password);
    await users.createUser(new_user);

    let session = new EntitySession(0, new_user.id, '');
	session.randomizeRefreshToken();
	let sessions = req.app.models.get('ModelSession');
	await sessions.createSession(session);

	let token = jwt.sign({jti: session.jti}, req.app.config.appSecret, {
		expiresIn: 86400 // expires in 24 hours
	});

	res.cookie('token', token);
	res.redirect('/');
});

let returnErrorResponse = (res, formData, message) => {
    res.render('register', {
        layout: 'external.layout.hbs',
        title: 'Register',
        serverMessage: message,
        formData: formData
    });
}

module.exports = router;