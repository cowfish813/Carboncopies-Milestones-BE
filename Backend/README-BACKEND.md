## Tech Stack 
Node.js, Express.js, Neo4j 

# Included Libraries
UUID
neo4j-driver

## To start Backend Server from terminal
1. Navigate to Backend Folder
2. Type "npm i" into the terminal and hit enter
    - this will install node modules to your local device
3. Create ".env" file
4. add the following key parameters as directed via messaging
    NEO4J_PROTOCOL= <YOUR PROTOCOL>
    NEO4J_HOST = <NEO4J HOST>
    NEO4J_USERNAME = <USERNAME>
    NEO4J_PASSWORD = <PASSWORD>
    NEO4J_PORT= <PORT>
    # for driver/session
    NEO4J_URI= <NEO4J URI>
    NEO4J_DATABASE= <DATABASE NAME>
5. npm run start:dev
    - this will create the backend server on port 5001. You are now free to hit the API routes

## Routes
    - local routes can be achieved on postman or Frontend framework of choice as...


# HTTP Request: GET 
- entire list of all Milestones
- EXCLUDES submilestones at this time
- Route: localhost:5001/api/milestones/all


# HTTP Request: GET 
- Milestones with relationships
- EXCLUDES submilestones at this time
- Route: localhost:5001/api/milestones
Example output
```
[
  [
    Node {
      identity: [Integer],
      labels: [Array],
      properties: [Object],
      elementId: '4:633d82dd-2b89-48b1-8146-10c2b6fb7e10:27'
    },
    Relationship {
      identity: [Integer],
      start: [Integer],
      end: [Integer],
      type: 'PRECEDES',
      properties: {},
      elementId: '5:633d82dd-2b89-48b1-8146-10c2b6fb7e10:1',
      startNodeElementId: '4:633d82dd-2b89-48b1-8146-10c2b6fb7e10:27',
      endNodeElementId: '4:633d82dd-2b89-48b1-8146-10c2b6fb7e10:28'
    },
    Node {
      identity: [Integer],
      labels: [Array],
      properties: [Object],
      elementId: '4:633d82dd-2b89-48b1-8146-10c2b6fb7e10:28'
    }
  ],
]
```
- Returned element is an array of arrays
    - each subarray contains 2 nodes and their relationship. The relationship element will contain information on the hierarchy of nodes
        startNodeElementId = Parent Node
        endNodeElementId = Successive Node
        Properties = Information carried on the node

HTTP Request: POST - create Milestone
- returns ID upon success
    - duration/probability edited by editor
        - hand keyed by user as "string" data
- required information for POST of a milestone...
    {
        "purpose": "new",
        "property": "new",
        "effort" : "3",
        "content": "new",
        "presentState": "new",
        "nearFuture": "new",
        "lessThanHalfway": "new",
        "halfway": "new",
        "overHalfway": "new",
        "nearFinished": "new",
        "fullHumanWBE": "new"
    }
- Route:localhost:5001/api/milestones

# HTTP Request: PATCH 
- Add properties to selected Milestone. Does NOT include relationships at this time
- Route:localhost:5001/api/milestones/:milestone_id

# HTTP Request: PATCH
- the first id (id1) will identify as the milestone that PRECEDES the second argument
- Route:localhost:5001/api/milestones/:id1/:id2

# HTTP Request: DELETE 
- deletes milestones and its relationships
- Route:localhost:5001/api/milestones/:milestone_id

# HTTP Request: DELETE 
- deletes ALL milestones
- in development
## DEVELOPER ROUTE ONLY 
- Route:localhost:5001/api/all
