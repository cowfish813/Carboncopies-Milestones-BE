const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
const {google} = require('googleapis');

const fs = require('fs');
const { Parser } = require('@json2csv/plainjs');

const { 
    NEO4J_URI, 
    NEO4J_USERNAME, 
    NEO4J_PASSWORD, 
    CLIENT_ID, 
    CLIENT_SECRET, 
    REFRESH_TOKEN 
    } = process.env;

const driver = new neo4j.driver(NEO4J_URI, 
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
const jsonName = `${Date.now()}ccf${uuidv4()}.json`;
const csvName = `${Date.now()}ccf${uuidv4()}.csv`;

const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID, 
    CLIENT_SECRET, 
    REDIRECT_URI,
);

const googleSharedDriveID = '1Spm0zSrUPb4McJjvNylngzWHmJKF8VXy';//Shared Drives - Education - Roadmap Vis

oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const postToDrive = async (name, file) => {
    const googleAuth = { version: 'v3', auth: oAuth2Client };
    const drive = google.drive(googleAuth);

    const fileMetaData = {
        name,
        mimeType: 'text/json',
    };
    const media = {
        mimeType: 'text/json',
        body: JSON.stringify(file)
    };
    const requestBody = {
        name,
        resource: fileMetaData,
        mimeType: 'text/json', //mimetype package can identify file
        parents: [googleSharedDriveID]
    };

    try {
        const response = await drive.files.create({
            supportsAllDrives: true,
            requestBody,
            media,
            fields: 'id, name'
        })

        console.log('drive ID:', response.data.id);
    } catch (e) {
        console.log(e.message, e);
    }
};

const downloadFromDrive = async (drive, fileId) => {1
    const res = await drive.files.get({
        fileId,
        alt: "media"
    }, {
        responseType:"stream"
    })
    return res.data;
};

// const uploadToNeo4j = async (fileId) => {
//     const stream = await downloadFromDrive(drive, fileId);
//     stream(on("data", chunk => {
//         const data = JSON.parse(chunk.toString());
//     }))
// };

router.post('/', async (req, res) => {
    const cypher = `
        LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/1ltaLzU6USZpaNilNad0CTflIqMduIOZ-nrp6aevIDeg/export?format=csv' AS row
        RETURN row
    `


    const session = driver.session();
    const updated = new Date(Date.now()).toString();
    const url = req.body.url;
    const props = {url, updated};

    try {
        const result = await session.run(cypher);
        console.log(result)
        res.send(result);
    } catch (e) {
        console.log(e);
    }
});

router.get('/', async (req, res) => {
    //downloads from neo4j
    //uploads to google drive
    const cypher = `
        CALL apoc.export.json.all(null, {stream:true})
        YIELD file, nodes, relationships, properties, data
        RETURN file, nodes, relationships, properties, data
        `;
    const session = driver.session();
    try {
        // const parser = new Parser();
        
        const result = await session.run(cypher);
        const data = result.records.map(record => record._fields[4]);

        // const csv = parser.parse(result)
        // postToDrive(csvName, data);
        postToDrive(jsonName, result);
        res.send(data);
        session.close();
    } catch (e) {
        console.log(e);
    }
});

router.get('/csv', async (req, res) => {
    const cypher = ` 
    CALL apoc.export.csv.all(null, {stream: true})
        YIELD file, nodes, relationships, properties, data
        RETURN file, nodes, relationships, properties, data
        `;
    const session = driver.session();
    try {
        const result = await session.run(cypher);    
        csvToDrive(csvName, (result.records.map(record => record._fields)[0][4]));
        res.send(result);
        session.close();
    } catch (e) {
        console.log(e);
    }
});

const csvToDrive = async (name, file) => {
    const googleAuth = { version: 'v3', auth: oAuth2Client };
    const drive = google.drive(googleAuth);

    const fileMetaData = {
        name,
        mimeType: 'application/vnd.google-apps.spreadsheet',
    };
    const media = {
        mimeType: 'application/vnd.google-apps.spreadsheet',
        body: file
    };
    const requestBody = {
        name,
        resource: fileMetaData,
        mimeType: 'application/vnd.google-apps.spreadsheet', //mimetype package can identify file
        parents: [googleSharedDriveID]
    };

    try {
        const response = await drive.files.create({
            supportsAllDrives: true,
            requestBody,
            media,
            fields: 'id, name'
        })

        console.log('drive ID:', response.data.id);
    } catch (e) {
        console.log(e.message, e);
    }
};

const spreadsheet = router;
module.exports = spreadsheet;