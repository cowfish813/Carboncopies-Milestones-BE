To start Backend Server from terminal

1. Navigate to Backend Folder
2. npm i
3. Create "config" Folder
4. Create "keys.js" in "config" Folder
5. add "export const MONGO_URI = {YOUR MONGODB KEY STRING}" to keys.js
6. Navigate back to main Backend Folder
7. npm run start:dev


## Tech Stack 
Node.js, Express.js, Neo4j 

# Included Libraries
UUID
neo4j-driver

## Routes
HTTP Request: GET 
- enter list of all Milestones and their relationships
- EXCLUDES submilestones
localhost:5001/api/milestones

HTTP Request: POST - create Milestone
- returns ID upon success
localhost:5001/api/milestones

HTTP Request: PATCH 
- Add properties to selected Milestone => include relationships?
localhost:5001/api/milestones:milestone_id

HTTP Request: DELETE 
- deletes milestones, its relationships, subMilestones, and milestones related to subMilestones
localhost:5001/api/milestones:milestone_id

HTTP Request: DELETE 
- deletes ALL milestones
## DEVELOPER ROUTE ONLY 
localhost:5001/api/all
