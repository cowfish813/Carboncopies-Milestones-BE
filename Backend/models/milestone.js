import {Model, Field} from "neo4j-node-ogm";

class Milestone extends Model {
    constructor(values) {
        const labels = ['Milestone']
        const attributes = {
            purpose: Field.String({
                required: true
            }),
            nextMilestone: Field.Relationships({ //next
                labels:['NEXTMILESTONE'],
                target: Milestone
            }),
            prevMilestone: Field.Relationships({ //prev
                labels:['PREVMILESTONE'],
                target: Milestone
            }),
            subMilestone: Field.Relationships({ //child relationships
                labels:['SUBMILESTONE'],
                target: Milestone
            }),
            content: Field.String(),
            presentState: Field.String(),
            nearFuture: Field.String(),
            lessThanHalfway: Field.String(),
            halfway: Field.String(),
            overHalfway: Field.String(),
            nearFinished: Field.String(),
            fullHumanWBE: Field.String(),
            created_at: Field.DateTime({
                default: 'NOW'
            })
        }
        super(values, labels, attributes);
    }
}

class Role extends Model {
  constructor (values, state = { language: 'en_US' }) {
    const labels = ['Role']
    const attributes = {
      key: Field.String({
        required: true,
        set: (value) => {
          return value.toUpperCase()
        },
        get: (value) => {
          return `key-${value}`
        }
      }),
      name: Field.Relationship({
        with: true,
        labels: ['TRANSLATE'],
        target: Text,
        filter_relationship: {
          language: state.language
        }
      })
    }
    super(values, labels, attributes)
  }
}

class User extends Model {
  constructor (values) {
    const labels = ['User']
    const attributes = {
      name: Field.String(),
      language: Field.String({
        valid: ['pt_BR', 'en_US']
      }),
      email: Field.String({
        max_length: 255,
        required: true
      }),
      password: Field.Hash(),
      created_at: Field.DateTime({
        default: 'NOW'
      }),
      role: Field.Relationship({
        labels: ['HAS_ROLE'],
        target: Role
      }),
      friends: Field.Relationships({
        labels: ['FRIENDSHIP'],
        target: User,
        attributes: {
          intimacy: Field.String()
        }
      })
    }
    super(values, labels, attributes)
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




// }, {timestamps: true});

// export const Milestone = mongoose.model('Milestone', MilestoneSchema);