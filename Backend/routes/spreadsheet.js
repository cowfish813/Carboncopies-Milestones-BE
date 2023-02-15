const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
const { 
    NEO4J_URI, 
    NEO4J_USERNAME, 
    NEO4J_PASSWORD, 
    CLIENT_ID, 
    CLIENT_SECRET, 
    REFRESH_TOKEN 
    } = process.env;

const driver = new neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
const sheetName = `${Date.now()}ccf${uuidv4()}.csv`;
const {google} = require('googleapis');
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client
});



const postToDrive = async (name, file) => {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: name,
                mimeType: 'application/json', //mimetype package can identify file
            },
            media: {
                mimeType: 'aplpication/json',
                body: JSON.stringify(file)
            }
        })
        console.log(response.data);
    } catch (e) {
        console.log(e.message);
    }
};
//  /Shared drives/Education/Roadmap Visualization

router.get('/', async (req, res) => {
    const cypher = `
        CALL apoc.export.csv.all(null, {stream:true})
        YIELD file, nodes, relationships, properties, data
        RETURN file, nodes, relationships, properties, data
        `;
    const session = driver.session();
    try {
        const result = await session.run(cypher);
        const data = result.records.map(record => record._fields[4]);
        postToDrive(sheetName, data);
        res.send(data);
        session.close();
    } catch (e) {
        console.log(e);
    }
});

const spreadsheet = router;
module.exports = spreadsheet;