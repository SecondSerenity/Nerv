const bcrypt = require('bcryptjs');

class EntityUser {
    constructor(id, username, email, passwordHash) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password_hash = passwordHash;  
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
}

module.exports = EntityUser;