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
        this.date = Date.now();
        this.updated_at = Date.now();
    }
}

module.exports = Milestone;