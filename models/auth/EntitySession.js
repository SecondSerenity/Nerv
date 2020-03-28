const crypto = require('crypto');

class EntitySession {
    constructor(jti, userId, refreshToken, expires) {
        this.jti = jti;
        this.user_id = userId;
        this.refresh_token = refreshToken;
        this.expires = expires;
    }

    randomizeRefreshToken() {
        this.refresh_token = crypto.randomBytes(50).toString('hex');
    }
}

module.exports = EntitySession;