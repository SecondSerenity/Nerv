const express = require('express');
const {check, validationResult} = require('express-validator');
const EntityUser = require('../../models/user/EntityUser');
const ControllerAuth = require('../../controllers/ControllerAuth');

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

    let auth_controller = new ControllerAuth(req.app.models, req.app.config.appSecret);
    let session_data = await auth_controller.createNewSession(new_user);
	res.cookie('token', session_data.token);
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