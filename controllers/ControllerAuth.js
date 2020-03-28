const jwt = require('jsonwebtoken');
const EntitySession = require('../models/auth/EntitySession');

class ControllerAuth {
    /**
     * @param {DbModelFactory} modelFactory
     */
    constructor(modelFactory, secret) {
        this.sessions = modelFactory.get('ModelSession');
        this.users = modelFactory.get('ModelUser');
        this.secret = secret;
    }

    /**
     * @param {string} login 
     * @param {string} password 
     */
    async login(login, password) {
        let user = await this.users.getUserByLogin(login);
        if (user === null || !user.checkPassword(password)) {
            return null;
        }

        return await this.createNewSession(user);
    }

    /**
     * @param {EntityUser} user
     * 
     * @returns {Object}
     */
    async createNewSession(user) {
        let session = new EntitySession(0, user.id, '');
        session.randomizeRefreshToken();
        await this.sessions.createSession(session);
    
        let token = jwt.sign({jti: session.jti}, this.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        return {
            token: token,
            session: session
        }
    }

    /**
     * @param {bool} ignoreExp
     * 
     * @returns {bool}
     */
    async checkTokenValidity(token, ignoreExp=false) {
        let options = {ignoreExpiration: ignoreExp};
        return new Promise((resolve) => {
            jwt.verify(token, this.secret, options, (error, decoded) => {
                if (error) {
                    resolve(null);
                }
                resolve(decoded);
            });
        });
    }

    /**
     * @param {Object} tokenPayload
     * 
     * @returns {Object}
     */
    async findSession(tokenPayload) {
        let active_session = await this.sessions.getSession(tokenPayload.jti);
        if (!active_session) {
            return null;
        }

        return {
            session: active_session,
            user: await this.users.getUserById(active_session.user_id)
        }
    }

    /**
     * @param {EntitySession} session
     */
    async deleteSession(session) {
        await this.sessions.deleteSession(session.jti);
    }
}

module.exports = ControllerAuth;