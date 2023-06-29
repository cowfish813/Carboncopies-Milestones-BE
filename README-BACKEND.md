## Tech Stack 
- Node.js
- Express.js
- Neo4j
- Cypher
- AuraDB
- axios
- Google Drive

# Included Libraries
- UUID
- Google API

## To start Backend Server from terminal
1. Navigate inside Backend Folder
    - this will be our "root directory"
2. Type "npm i" into the terminal and hit enter
    - this will install node modules to your root directory
3. Create ".env" file in the root directory of "Backend" folder
4. add the following key parameters into the ".env" file as directed via messaging
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



# Milestone APIs
- These routes will reference the retrieval, creation, patching, and destruction of nodes and their relationships

## Create - HTTP Request: POST
### Route:localhost:5001/api/milestones
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
    - Effort refers to an integer value between 1 and 3

### Route:localhost:5001/api/milestones/:id
- Creates new Milestone with reference to its previous milestone
- :id is a wildcard and is a reference point to attach a new milestone as its successor
    - :id PRECEDES new Milestone 

## Read - HTTP Request: GET 
### Route: localhost:5001/api/milestones/all
    - entire list of all Milestones
    - EXCLUDES submilestones at this time
### Route: localhost:5001/api/milestones
    - Inclusive of all relationships for MILESTONE labels
    - EXCLUDES submilestones at this time
- Example output
    ```
    [
        [
            {
                identity: [Integer],
                labels: [Array],
                properties: [Object],
                elementId: '4:633d82dd-2b89-48b1-8146-10c2b6fb7e10:27'
            },
            {
                identity: [Integer],
                start: [Integer],
                end: [Integer],
                type: 'PRECEDES',
                properties: {},
                elementId: '5:633d82dd-2b89-48b1-8146-10c2b6fb7e10:1',
                startNodeElementId: '4:633d82dd-2b89-48b1-8146-10c2b6fb7e10:27',
                endNodeElementId: '4:633d82dd-2b89-48b1-8146-10c2b6fb7e10:28'
            },
            {
                identity: [Integer],
                labels: [Array],
                properties: [Object],
                elementId: '4:633d82dd-2b89-48b1-8146-10c2b6fb7e10:28'
            }
        ],
        
        [
            {
                identity: [Integer],
                labels: [Array],
                properties: [Object],
            },
            []
        ],
    ]
    ```
    - Returned element is an array of arrays
        - each subarray, if it has a relationship, contains 2 nodes and their relationship. The relationship element will contain information on the hierarchy of nodes
            startNodeElementId = Parent Node
            endNodeElementId = Successive Node
            Properties = Information carried on the node
        - Nodes without the specified relationship are represented as an array with 2 elements

### Route: localhost:5001/api/milestones/:milestone_id
- Returns unique milestone, based on params/ID in the URL, and all of its chain of relationships
-  All appropriate nodes fall within the records array of objects

## Update - HTTP Request - PATCH
### Route:localhost:5001/api/milestones/:milestone_id
- Add properties to selected Milestone. This route DOES NOT include relationships at this time
### Route:localhost:5001/api/milestones/:id1/:id2
- The first id (id1) will identify as the milestone that PRECEDES the second argument

## Destroy - HTTP Request - DELETE
### Route:localhost:5001/api/milestones/:milestone_id
- Deletes milestones and its relationships
### Route:localhost:5001/api/milestones/rel/:id1/:id2
- Deletes Relationship

### Route:localhost:5001/api/milestones/all
- deletes ALL milestones
- in development


# Spreadsheet Routes
- These routes refer to interaction with the shared organization Google Drive in the subfolders Shared drives -> Education -> Roadmap Visualization
- To get it working, it will require additional properties to the ".env" file including...
    CLIENT_ID
    CLIENT_SECRET
    REDIRECT_URI
    REFRESH_TOKEN = obtain new access tokens
    GOOGLE_SHARED_DRIVE_ID = The ID of folder to save CSVs of our database
- more information on using OAuth 2.0 to access Google APIs can be found here https://developers.google.com/identity/protocols/oauth2

## HTTP Request: PUT
### Route localhost:5001/api/spreadsheet/:drive_id/
- This route takes in an argument that is the driveID for the sheet.
    - The driveID can be identified from the link of an existing document in the shared drive Roadmap Visualization
        - the following is a clicked link for an unspecified file in google drive 
            - ex.: https://docs.google.com/spreadsheets/d/DRIVE_ID/edit#gid=348246882
            - the example route will look like "localhost:5001/api/spreadsheet/DRIVE_ID"
- contains 2 cypher queries.
    - cypherCSV will parse the argument link and create nodes
    - cypherRelationship parses the argument for 3 specific headers listed below in the bottom right side of the spreadsheet as _start, _end, _type => first node, successive node, relationship name
- Users are allowed to edit or add to any part of the spreadsheet except adding a new header property or "label". The code is not designed to take in new header information at this time
- When editing the document AT THIS TIME: 
    - Purpose column MUST be filled out
- When editing relationships in the _start, _end, and _type columns
    - _start: the unique _id of the PRECEDESing node
    - _end: the unique _id successive node
    - _type: nature of relationship. CASE SENSITIVE
        - TIP: to avoid confusion, download complete the spreadsheet GET request. The database will assign unique _id values to any node that was uploaded previously. You may then edit the relationships


## HTTP Request: GET
### Route localhost:5001/api/spreadsheet/
- Downloads entire databse and Uploads to google share drive
    - From google drive home and Carboncopies account: Shared drives -> Education -> Roadmap Visualization
- Returns Drive ID for identification and can be used to provide or forward a user to the link to access the drive document
    - ex. https://docs.google.com/spreadsheets/d/DRIVE_ID/
        - "DRIVE_ID" part of the URL is the important part to parse out for backend consumption
    - the sheet is publicly accessible for anyone, regardless of affiliation with the organization


# Env File Keys
## Neo4j Operations
- NEO4J_PROTOCOL
- NEO4J_HOST 
- NEO4J_USERNAME 
- NEO4J_PASSWORD 
- NEO4J_PORT
### for driver/session
- NEO4J_URI
- NEO4J_DATABASE

# Google Drive Operations
- CLIENT_ID
- CLIENT_SECRET
- REFRESH_TOKEN
- GOOGLE_SHARED_DRIVE_ID= Parent Drive ID