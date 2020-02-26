const EntityInvite = require('./EntityInvite');

class ModelInvite {
    /**
     * @param {Database} db 
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * @param {string} pinCode
     * 
     * @returns {EntityInvite|null}
     */
    async getActiveInvite(pinCode) {
        let query = "SELECT * FROM invites WHERE pin_code = ? AND expires > datetime('now')";
        let result = await this.db.get(query, [pinCode]);
        if (result == undefined) {
            return null;
        }

        return EntityInvite.createFromDb(result);
    }

    /**
     * @param {EntityInvite} invite 
     */
    async createInvite(invite) {
        let query = `
            INSERT INTO invites(
                pin_code,
                expires
            ) VALUES (?, ?)
        `;
        let params = [invite.pin_code, invite.expires];

        await this.db.run(query, params);
    }

    /**
     * @param {number} id 
     */
    async deleteInvite(id) {
        let query = "DELETE FROM invites WHERE id = ?";
        await this.db.run(query, [id]);
    }
}

module.exports = ModelInvite;