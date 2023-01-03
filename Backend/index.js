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
        // console.log(res.records);
        result.records.forEach(record => {
            console.log(record._fields[0].properties)
            milestoneArr.push({
                id: record._fields[0].identity.low,
                purpose: record._fields[0].properties.purpose,
                //delete name when we get real stuff going
                name: record._fields[0].properties.name,
                name: record._fields[0].properties.id,
            })
        })
        res.send(milestoneArr);
        session.close();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
})



// (async() => {    
//     // To learn more about the driver: https://neo4j.com/docs/javascript-manual/current/client-applications/#js-driver-driver-object
//     try {
//         const person1Name = 'Alice';
//         const person2Name = 'David';
//         await createFriendship(driver, person1Name, person2Name);
//         await findPerson(driver, person1Name);
//         await findPerson(driver, person2Name);
//     } catch (error) {
//         console.error(`Something went wrong: ${error}`);
//     } finally {
//         // Don't forget to close the driver connection when you're finished with it.
//         await driver.close();
//     }

//     async function createFriendship (driver, person1Name, person2Name) {
//         // To learn more about sessions: https://neo4j.com/docs/javascript-manual/current/session-api/
//         const session = driver.session({ database: 'neo4j' });
//         try {
//             // To learn more about the Cypher syntax, see: https://neo4j.com/docs/cypher-manual/current/
//             // The Reference Card is also a good resource for keywords: https://neo4j.com/docs/cypher-refcard/current/
//             const writeQuery = `MERGE (p1:Person { name: $person1Name })
//                                 MERGE (p2:Person { name: $person2Name })
//                                 MERGE (p1)-[:KNOWS]->(p2)
//                                 RETURN p1, p2`;
//             // Write transactions allow the driver to handle retries and transient errors.
//             const writeResult = await session.executeWrite(tx =>
//                 tx.run(writeQuery, { person1Name, person2Name })
//             );
//             // Check the write results.
//             writeResult.records.forEach(record => {
//                 const person1Node = record.get('p1');
//                 const person2Node = record.get('p2');
//                 console.info(`Created friendship between: ${person1Node.properties.name}, ${person2Node.properties.name}`);
//             });
//         } catch (error) {
//             console.error(`Something went wrong: ${error}`);
//         } finally {
//             // Close down the session if you're not using it anymore.
//             await session.close();
//         }
//     }

//     async function findPerson(driver, personName) {
//         const session = driver.session({ database: 'neo4j' });
//         try {
//             const readQuery = `MATCH (p:Person)
//                             WHERE p.name = $personName
//                             RETURN p.name AS name`;
            
//             const readResult = await session.executeRead(tx =>
//                 tx.run(readQuery, { personName })
//             );
//             readResult.records.forEach(record => {
//                 console.log(`Found person: ${record.get('name')}`)
//             });
//         } catch (error) {
//             console.error(`Something went wrong: ${error}`);
//         } finally {
//             await session.close();
//         }
//     }
// })();

// const database = getConnection()
// try {
//   const session = database.session()
//   const result = await session.run('MATCH (users:Users {name : $nameParam}) RETURN users', {
//     nameParam: 'Natam'
//   })
//   result.records.forEach(record => {
//     console.log(record.get('name'))
//   })
//   session.close()
// } catch(e) {
//   console.log("hello world =>", e)
// }
