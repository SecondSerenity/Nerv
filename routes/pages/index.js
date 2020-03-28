const express = require('express');
let router = express.Router();
let ControllerAuth = require('../../controllers/ControllerAuth');
let authenticate = require('../middleware/authenticate').browserAuthenticate;

const renderInternalPage = (route, name, title) => {
	router.get(route, authenticate, function (req, res) {
		let page_data = {
			layout: 'internal.layout.hbs',
			title: title,
			username: req.user.username
		};
		page_data['on' + title] = true;
		res.render(name, page_data);
	});
};

renderInternalPage('/', 'dashboard', 'Dashboard');
renderInternalPage('/sensors', 'sensors', 'Sensors');
renderInternalPage('/inventory', 'inventory', 'Inventory');
renderInternalPage('/settings', 'settings', 'Settings');

router.use('/login', require('./login.router'));
router.use('/register', require('./register.router'));

router.post('/logout', authenticate, (req, res) => {
	let controller = new ControllerAuth(req.app.models, req.app.config.appSecret);
	controller.deleteSession(req.session);
	res.clearCookie('token').clearCookie('refresh');
	res.redirect('/login');
});

module.exports = router;
