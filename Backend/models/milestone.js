import {Model, Field} from "neo4j-node-ogm";

class Milestone extends Model {
    constructor(values) {
        const labels = ['Text']
        const attributes = {
            
        }
    }
}
//for each milestone
    //what kind of intitiatives toward that milestone?
    //prject to scan complete fruit fly brain
        //lab or researcher working on it?
        //1 or more initiatives
            //initiative would have separate schema
        // what if 3 labs developing scan
            //each of those efforts might 
    //lab name, researchers, commercial effort, estimated duration and cost
    // lab name
        //probably a different model
    // person => different model

    //effort => property =? string based on string 1, 2, 3

    // add Property => problem area => map to specific color
        //static mapping property on FE
        //

        
        //RELATIONSHIP called => precede/succeed 
        
        // ADD PROPERTY => notes, value=""
        // have property key => "Problem Area"
        // value => Modeling, Robotic Embodiment, Scanning, Structure, Tracing, Virtual Embodiment,
        //CREATED BY
        //UPDATED BY

        // user auth second model




// const Schema = mongoose.Schema;

// const MilestoneSchema = Schema({
//     purpose: {
//         type: String,
//         required: true
//     },

//     content: {
//         type: String,
//     }, 
    
//     // 

//     // previous: {
//     //     type: Map,
//     //     of: String
//     // },
    
//     // children: {
//     //     type: Map,
//     //     of: String
//     // }, //should i key in and edit on backend with each delete?
        
//     // or should it be a nested object starting with parents?
//     children: {
//         type: [ this ],
//         default: {}
//     },

//     next: {
//         type: [ this ],
//         default: {}
//     },
//     // 

//     // author: {
//     //     type: String,
//     // }, //figure out after OAuth

    
//     // mostRecentlyUpdatedBy {
//     //     type: String
//     // },


//     presentState: {
//         type: String
//     },
    
//     nearFuture: {
//         type: String
//     },

//     lessThanHalfway: {
//         type: String
//     },

//     halfway: {
//         type: String
//     },

//     overHalfway: {
//         type: String
//     },

//     nearFinished: {
//         type: String
//     },

//     fullHumanWBE: {
//         type: String
//     }

// }, {timestamps: true});

// export const Milestone = mongoose.model('Milestone', MilestoneSchema);