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
    
    // 

    // previous: {
    //     type: Map,
    //     of: String
    // },
    
    // children: {
    //     type: Map,
    //     of: String
    // }, //should i key in and edit on backend with each delete?
        
    // or should it be a nested object starting with parents?
    children: {
        type: [ this ],
        default: {}
    },

    next: {
        type: [ this ],
        default: {}
    },
    // 

    // author: {
    //     type: String,
    // }, //figure out after OAuth

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