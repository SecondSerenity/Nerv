const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    let token = req.cookies['token'];
    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, req.app.config.appSecret, async (error, decoded) => {
        if (error) {
            return res.redirect('/login');
        }

        let sessions = req.app.models.get('ModelSession');
        let active_session = await sessions.getSession(decoded.jti);
        if (!active_session) {
            return res.redirect('/login');
        }

        // if everything good, save to request for use in other routes
        let users = req.app.models.get('ModelUser');
        req.app.set('session', active_session);
        req.app.set('user', await users.getUserById(active_session.user_id));
        next();
    });
}