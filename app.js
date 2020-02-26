var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbsextend = require('./services/hbsextend');
const sqlite = require('sqlite');

const DbModelFactory = require('./services/DbModelFactory');
const ModelUser = require('./models/user/ModelUser');
const ModelInvite = require('./models/invite/ModelInvite');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// add extend/block features to handlebars
hbsextend();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

sqlite.open('app.db').then((db) => {
	let model_factory = new DbModelFactory(db);
	model_factory.register('ModelUser', ModelUser);
	model_factory.register('ModelInvite', ModelInvite);
	app.models = model_factory;
});

app.use('/', require('./routes/pages'));
app.use('/api/users', require('./routes/apiUsers'));
app.use('/thirdparty', require('./routes/thirdparty.router'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;