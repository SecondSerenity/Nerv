const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
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