const jwt = require('jsonwebtoken');

module.exports.browserAuthenticate = async (req, res, next) => {
    let token = req.cookies['token'];
    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, req.app.config.appSecret, async (error, decoded) => {
        if (error) {
            res.clearCookie('token');
            res.redirect('/login');
            return;
        }

        let sessions = req.app.models.get('ModelSession');
        let active_session = await sessions.getSession(decoded.jti);
        if (!active_session) {
            res.clearCookie('token');
            res.redirect('/login');
            return;
        }

        // if everything good, save to request for use in other routes
        let users = req.app.models.get('ModelUser');
        req.session = active_session;
        req.user = await users.getUserById(active_session.user_id);
        next();
    });
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

    jwt.verify(parts[1], req.app.config.appSecret, async (error, decoded) => {
        if (error) {
            return res.status(401).json(INVALID_TOKEN_MESSAGE);
        }

        let sessions = req.app.models.get('ModelSession');
        let active_session = await sessions.getSession(decoded.jti);
        if (!active_session) {
            return res.status(401).json(INVALID_TOKEN_MESSAGE);
        }

        // if everything good, save to request for use in other routes
        let users = req.app.models.get('ModelUser');
        req.session = active_session;
        req.user = await users.getUserById(active_session.user_id);
        next();
    });
};