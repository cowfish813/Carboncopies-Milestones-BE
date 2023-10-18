this.const = { v4: uuidv4 } = require('uuid');

class User {
    constructor(val) {
        this.user_id = "id", 
            // use google id from req.user.id
                //how do i persist loggedin for the app?
        this.email = val.email;
        this.password = val.password;
        this.property = val.property;
        this.created_at = new Date(Date.now()).toString();
        this.updated_at = new Date(Date.now()).toString();
    }
}

module.exports = User;