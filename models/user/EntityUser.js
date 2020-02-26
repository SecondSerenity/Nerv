const bcrypt = require('bcryptjs');

class EntityUser {
    constructor(username, email) {
        this.id = 0;
        this.password_hash = '';
        this.username = username;
        this.email = email;        
    }

    setPassword(unhashed) {
        this.password_hash = bcrypt.hashSync(unhashed, 8);
    }

    checkPassword(unhashed) {
        return bcrypt.compareSync(unhashed, this.password_hash);
    }

    toJSON() {
        let data = {... this};
        delete data.password_hash;
        return data;
    }

    /**
     * @param {object} record
     * 
     * @returns {EntityUser}
     */
    static createFromDb(record) {
        let user = new EntityUser(record.username, record.email);
        user.id = record.id;
        user.password_hash = record.password_hash;
        return user;
    }
}

module.exports = EntityUser;