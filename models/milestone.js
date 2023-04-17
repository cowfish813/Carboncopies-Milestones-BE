this.const = { v4: uuidv4 } = require('uuid');
uuidv4();

class Milestone {
    constructor(val) {
        this.milestone_id = uuidv4();
        this.purpose = val.purpose;
        this.property = val.property;
        this.effort = val.effort;
        this.presentState = val.presentState;
        this.nearFuture = val.nearFuture;
        this.lessThanHalfway = val.lessThanHalfway;
        this.halfway = val.halfway;
        this.overHalfway = val.overHalfway;
        this.nearFinished = val.nearFinished;
        this.fullHumanWBE = val.fullHumanWBE;
        this.created_at = new Date(Date.now()).toString();
        this.updated_at = new Date(Date.now()).toString();
    }
}

module.exports = Milestone;