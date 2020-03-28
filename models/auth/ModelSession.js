const moment = require('moment');
const EntitySession = require('./EntitySession');

class ModelSession {
    /**
     * @param {Database} db
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * @param {number} jti 
     * 
     * @returns {EntitySession|null}
     */
    async getSession(jti) {
        await this.deleteExpiredSessions();
        let query = 'SELECT * FROM sessions WHERE jti = ?';
        let result = await this.db.get(query, jti);
        if (result === undefined) {
            return null;
        }

        return new EntitySession(
            result.jti,
            result.user_id,
            result.refresh_token
        );
    }

    /**
     * @param {EntitySession} session 
     */
    async createSession(session) {
        let query = `
            INSERT INTO sessions(
                user_id,
                refresh_token,
                expires
            ) VALUES (?, ?, ?)
        `;
        let params = [session.user_id, session.refresh_token, session.expires];
        await this.db.run(query, params);

        query = 'SELECT last_insert_rowid() as id';
        let result = await this.db.get(query);
        session.jti = result.id;
    }

    async deleteExpiredSessions() {
        let now = moment().toISOString();
        let query = 'DELETE FROM sessions WHERE expires <= ?';
        await this.db.run(query, [now]);
    }

    /**
     * @param {number} jti 
     */
    async deleteSession(jti) {
        let query = 'DELETE FROM sessions WHERE jti = ?';
        await this.db.run(query, [jti]);
    }
}

module.exports = ModelSession;