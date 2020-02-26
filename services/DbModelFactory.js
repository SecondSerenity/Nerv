class DbModelFactory {
    constructor(db) {
        this.db = db;
        this.models = {};
    }

    register(name, model) {
        this.models[name] = model;
    }

    get(name) {
        let db_model = this.models[name];
        return new db_model(this.db);
    }
}

module.exports = DbModelFactory;