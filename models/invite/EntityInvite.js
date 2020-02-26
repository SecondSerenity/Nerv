const crypto = require('crypto');

class EntityInvite {
    constructor(newPin = true) {
        this.id = 0;
        this.pin_code = newPin ? crypto.randomBytes(8).toString('hex') : '';
        this.expires = new Date();
        this.expires.setDate(this.expires.getDate() + 1);
    }

    /**
     * @param {object} record
     * 
     * @returns {EntityUser}
     */
    static createFromDb(record) {
        let invite = new EntityInvite(false);
        invite.id = record.id;
        invite.pin_code = record.pin_code;
        invite.created = new Date(record.created);
        return invite;
    }
}

module.exports = EntityInvite;