const ControllerAuth = require('../../controllers/ControllerAuth');

module.exports.browserAuthenticate = async (req, res, next) => {
    let token = req.cookies['token'];
    let refresh = req.cookies['refresh'];
    if (!token || !refresh) {
        return res.redirect('/login');
    }

    let controller = new ControllerAuth(req.app.models, req.app.config.appSecret);
    let session_data = await controller.checkSessionValidity(token);
    if (!session_data) {
        session_data = await controller.refreshSession(token, refresh);
        if (!session_data) {
            res.clearCookie('token').clearCookie('refresh');
            return res.redirect('/login');
        }
        res.cookie('token', session_data.token);
        res.cookie('refresh', session_data.session.refresh_token);
    }

    // if everything good, save to request for use in other routes
    req.session = session_data.session;
    req.user = session_data.user;
    next();
}

let INVALID_TOKEN_MESSAGE = [{error:"Invalid or missing API token."}];
module.exports.apiAuthenticate = async (req, res, next) => {
    if (!req.header('Authorization')) {
        return res.status(401).json(INVALID_TOKEN_MESSAGE);
    }

    let auth = req.header('Authorization');
    let parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json(INVALID_TOKEN_MESSAGE);
    }

    let controller = new ControllerAuth(req.app.models, req.app.config.appSecret);
    let session_data = await controller.checkSessionValidity(parts[1]);
    if (!session_data) {
        return res.status(401).json(INVALID_TOKEN_MESSAGE);
    }

    // if everything good, save to request for use in other routes
    req.session = session_data.session;
    req.user = session_data.user;
    next();
};