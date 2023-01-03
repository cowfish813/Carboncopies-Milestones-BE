const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const neo4j = require('neo4j-driver');
const milestones = require('./routes/milestones.js');
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

const path = require('path');
const { fileURLToPath } = require('url');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use(express.json());
app.use('/api/milestones', milestones);

//view engine
// app.set('views', path.join(__dirname, 'views')); //set views to view folder
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false}));
// app.use(express.static(path.join(__dirname, 'public')));

//Neo4j connection
const driver = new neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
const cypher = 'MATCH (n) RETURN *';

app.get('/', async  (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run(cypher);
        const milestoneArr = [];
        result.records.forEach(record => {
            // console.log(record._fields[0].properties)
            if (record._fields[0].properties.milestone_id) {
                milestoneArr.push({
                    purpose: record._fields[0].properties.purpose,
                    id: record._fields[0].properties.milestone_id,
                    p: record._fields[0].properties.halfway,
    
                })
            }
        })
        res.send(milestoneArr);
        session.close();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
})