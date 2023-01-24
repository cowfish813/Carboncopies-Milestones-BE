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
5. enter 'npm run start:dev' into terminal in main directory of Backend
    - this will create the backend server on port 5001. You are now free to hit the API routes

## Routes
    - local routes can be achieved on postman or Frontend framework of choice as...



## Create - HTTP Request: POST
# Route:localhost:5001/api/milestones
- returns ID upon success
    - duration/probability edited by editor
        - hand keyed by user as "string" data
- required information for POST of a milestone...
    {
        "purpose": "content",
        "property": "content",
        "effort" : "3",
        "content": "content",
        "presentState": "content",
        "nearFuture": "content",
        "lessThanHalfway": "content",
        "halfway": "content",
        "overHalfway": "content",
        "nearFinished": "content",
        "fullHumanWBE": "content"
    }


## Read - HTTP Request: GET 
# Route: localhost:5001/api/milestones/all
    - entire list of all Milestones
    - EXCLUDES submilestones at this time
# Route: localhost:5001/api/milestones
    - Milestones with relationships
    - EXCLUDES submilestones at this time
- Example output
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

# Route: localhost:5001/api/milestones/:milestone_id
- Returns unique milestone, based on params/ID in the URL, and all of its chain of relationships
-  All appropriate nodes fall within the records array of objects


## Update - HTTP Request - PATCH
# Route:localhost:5001/api/milestones/:milestone_id
- Add properties to selected Milestone. This route DOES NOT include relationships at this time
# Route:localhost:5001/api/milestones/:id1/:id2
- The first id (id1) will identify as the milestone that PRECEDES the second argument

## Destroy - HTTP Request - DELETE
# Route:localhost:5001/api/milestones/:milestone_id
- Deletes milestones and its relationships

# HTTP Request: DELETE 
# Route:localhost:5001/api/milestones/rel/:id1/:id2
- Deletes Relationship

# Route:localhost:5001/api/milestones/all
- deletes ALL milestones
- in development
