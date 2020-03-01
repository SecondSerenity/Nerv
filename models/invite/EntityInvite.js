const crypto = require('crypto');

class EntityInvite {
    constructor(id, pinCode, expires) {
        this.id = id;
        this.pin_code = pinCode;
        this.expires = expires;
    }

    randomizePinCode() {
        this.pin_code = crypto.randomBytes(8).toString('hex');
    }

    setNewExpiration() {
        this.expires = new Date();
        this.expires.setDate(this.expires.getDate() + 1);
    }
}

module.exports = EntityInvite;