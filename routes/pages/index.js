const express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', {title: 'Express'});
});

router.use('/login', require('./login.router'));
router.use('/register', require('./register.router'));

module.exports = router;
