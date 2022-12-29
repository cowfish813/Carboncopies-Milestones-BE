import express from 'express';
import neo4j from 'neo4j-driver';
import { milestones } from './routes/milestones.js';
import { uri, user, password } from './config/keys.js';

// import path from 'path';
// import logger from 'morgan';
// import bodyParser from 'body-parser';


import { getConnection } from 'neo4j-node-ogm';

const app = express();
const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use(express.json());
app.use('/api/milestones', milestones);


// app.use(() => neo4j);

app.get('/',  (req, res) => {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    // Create Driver session
    // const session = req.driver.session();
    const cypher = 'MATCH (n) RETURN count(n) as count';

    session.run(cypher)
        .then(result => {
            // On result, get count from first record
            const count = result.records[0].get('count');
            // Send response
            res.send({count: count.toNumber()});
        })
        .catch(e => {
            // Output the error
            res.status(500).send(e);
        })
        .then(() => {
            // Close the session
            return session.close();
        });
});




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
