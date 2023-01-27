const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const neo4j = require('neo4j-driver');
const milestones = require('./routes/milestones.js');
const spreadsheet = require('./routes/spreadsheet.js');
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

const path = require('path');
const { fileURLToPath } = require('url');
const logger = require('morgan');
const bodyParser = require('body-parser');
const { type } = require('os');

const app = express();
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use(express.json());
app.use('/api/milestones', milestones);
app.use('/api/spreadsheet', spreadsheet);

// view engine => unecessary for Front End dev
// app.set('views', path.join(__dirname, 'views')); //set views to view folder
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false}));
// app.use(express.static(path.join(__dirname, 'public')));

//Neo4j connection
const driver = new neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

app.get('/', async  (req, res) => {
    // const cypher = 'MATCH (n) RETURN *';
    const cypher = 'MATCH (m: Milestone)-[r:PRECEDES]->(n:Milestone) RETURN m,r,n';
    const session = driver.session();
    try {
        const result = await session.run(cypher);
        const milestoneArr = result.records.map(record => record._fields)
        result.records.forEach(record => {
            milestoneArr.push(record._fields)
        })
        console.log(result)
        res.send(milestoneArr);
        session.close();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});