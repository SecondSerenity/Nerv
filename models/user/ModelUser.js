const EntityUser = require('./EntityUser');

class ModelUser {
    /**
     * @param {Database} db 
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * @returns {EntityUser[]}
     */
    async getAllUsers() {
        let query = "SELECT * FROM users";
        let results = await this.db.all(query);
        let users = [];
        for (let result of results) {
            users.push(EntityUser.createFromDb(result));
        }
        return users;
    }

    /**
     * @param {number} id
     * 
     * @returns {EntityUser|null}
     */
    async getUserById(id) {
        let query = "SELECT * FROM users WHERE id = ?";
        let result = await this.db.get(query, [id]);
        if (result === undefined) {
            return null;
        }

        return EntityUser.createFromDb(result);
    }

    /**
     * @param {string} name 
     * 
     * @returns {EntityUser|null}
     */
    async getUserByLogin(name) {
        let query = "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1";
        let result = await this.db.get(query, [name, name]);
        if (result === undefined) {
            return null;
        }

        return EntityUser.createFromDb(result);
    }

    /**
     * @param {EntityUser} entity
     */
    async createUser(entity) {
        let query = `
            INSERT INTO users (
                username,
                email,
                password_hash
            ) VALUES ( ?, ?, ?)
        `;
        let params = [entity.username, entity.email, entity.password_hash];

        await this.db.run(query, params);
    }
}

module.exports = ModelUser;