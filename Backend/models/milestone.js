import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MilestoneSchema = Schema({
    purpose: {
        type: String,
        required: true
    },

    content: {
        type: String,
    }, 

    previous: {
        type: Array
    },
    
    children: {
        type: Array
    },

    // author: {
    //     type: String,
    // },

    presentState: {
        type: String
    },
    nearFuture: {
        type: String
    },
    lessThanHalfway: {
        type: String
    },
    halfway: {
        type: String
    },
    overHalfway: {
        type: String
    },
    nearFinished: {
        type: String
    },
    fullHumanWBE: {
        type: String
    }

}, {timestamps: true});

export const Milestone = mongoose.model('Milestone', MilestoneSchema);