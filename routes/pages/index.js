const express = require('express');
let router = express.Router();
let authenticate = require('../middleware/authenticate');

/* GET home page. */
router.get('/', authenticate, function (req, res) {
	res.render('index', {username: req.app.get('user').username});
});

router.use('/login', require('./login.router'));
router.use('/register', require('./register.router'));

router.post('/logout', (req, res) => {
	let sessions = req.app.models.get('ModelSession');
	sessions.deleteSession(req.app.get('session').jti);
	req.app.set('session', null);
	req.app.set('user', null);
	res.clearCookie('token');
	res.redirect('/login');
});

module.exports = router;
