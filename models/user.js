class User {
    constructor(val) {
        this.user_id = val.user_id;
        this.displayName = val.displayName;
        this.email = val.email;
        this.photos = val.photos;
        this.created_at = new Date(Date.now()).toString();
    }
}

module.exports = User;