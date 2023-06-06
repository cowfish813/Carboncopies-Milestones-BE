this.const = { v4: uuidv4 } = require('uuid');
uuidv4();

class User {
    constructor(val) {
        this.user_id = uuidv4();
        this.email = val.email;
        this.password = val.password;
        this.property = val.property;
        this.created_at = new Date(Date.now()).toString();
        this.updated_at = new Date(Date.now()).toString();
    }
}

module.exports = User;