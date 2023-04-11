const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
const {google} = require('googleapis');
const {GoogleAuth} = require('google-auth-library');
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
const csvName = `${Date.now()}ccf${uuidv4()}.csv`;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID, 
    CLIENT_SECRET, 
    REDIRECT_URI,
);

const googleSharedDriveID = '1Spm0zSrUPb4McJjvNylngzWHmJKF8VXy';
    //Shared Drives - Education - Roadmap Vis

oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
const downloadFromDrive = async (realFileId) => {
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({version: 'v3', auth: oAuth2Client});
    fileId = realFileId;
    try {
        //files.get?
        const file = await service.files.export({
            fileId,
            // alt: 'media',
            mimeType: 'text/csv'
        });
        return file;
    } catch (err) {
        console.log(err, 'error');
        throw err;
    }
};

// download from google drive
router.post('/', async (req, res) => {
    console.log();

    const id = '10Z1I70fVqE7yRDkhZoMbcG1Cx3CCScfBJzKvnkfwux8';

    // const cypher = `
    //     LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/10Z1I70fVqE7yRDkhZoMbcG1Cx3CCScfBJzKvnkfwux8/export?format=csv' AS csv
    //     WITH csv 
    //     WHERE csv._labels IS NOT NULL
    //     AND csv._id IS NOT NULL
    //     AND csv.effort IS NOT NULL
    //     AND csv.fullHumanWBE IS NOT NULL
    //     AND csv.halfway IS NOT NULL
    //     AND csv.lessThanHalfway IS NOT NULL
    //     AND csv.milestone_id IS NOT NULL
    //     AND csv.name IS NOT NULL
    //     AND csv.nearFinished IS NOT NULL
    //     AND csv.nearFuture IS NOT NULL
    //     AND csv.overHalfway IS NOT NULL
    //     AND csv.presentState IS NOT NULL
    //     AND csv.property IS NOT NULL
    //     AND csv.purpose IS NOT NULL
    //     AND csv._start IS NOT NULL
    //     AND csv._end IS NOT NULL
    //     AND csv._type IS NOT NULL
    //     AND csv.updated_at IS NOT NULL
    //     MERGE (m:MILESTONE {
    //         _id: csv._id,
    //         _labels: csv._labels,
    //         effort: csv.effort,
    //         fullHumanWBE: csv.fullHumanWBE,
    //         halfway: csv.halfway,
    //         lessThanHalfway: csv.lessThanHalfway,
    //         milestone_id: csv.milestone_id,
    //         name: csv.name,
    //         nearFinished: csv.nearFinished,	
    //         nearFuture: csv.nearFuture, 
    //         overHalfway: csv.overHalfway,
    //         presentState: csv.presentState,
    //         property: csv.property,
    //         purpose: csv.purpose,
    //         _start: csv._start,
    //         _end: csv._end,
    //         _type: csv._type,
    //         updated_at: csv.updated_at
    //     })
    // `;

    const cypher = `
        LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/10Z1I70fVqE7yRDkhZoMbcG1Cx3CCScfBJzKvnkfwux8/export?format=csv' AS csv
        WITH csv 
        WHERE csv._labels IS NOT NULL
            AND csv._id IS NOT NULL
            AND csv.effort IS NOT NULL
            AND csv.fullHumanWBE IS NOT NULL
            AND csv.halfway IS NOT NULL
            AND csv.lessThanHalfway IS NOT NULL
            AND csv.milestone_id IS NOT NULL
            AND csv.name IS NOT NULL
            AND csv.nearFinished IS NOT NULL
            AND csv.nearFuture IS NOT NULL
            AND csv.overHalfway IS NOT NULL
            AND csv.presentState IS NOT NULL
            AND csv.property IS NOT NULL
            AND csv.purpose IS NOT NULL
            AND csv._start IS NOT NULL
            AND csv._end IS NOT NULL
            AND csv._type IS NOT NULL
            AND csv.updated_at IS NOT NULL
        MERGE (m:MILESTONE {
            _id: csv._id
        })
        ON CREATE SET m._labels = csv._labels,
            m.effort = csv.effort,
            m.fullHumanWBE = csv.fullHumanWBE,
            m.halfway = csv.halfway,
            m.lessThanHalfway = csv.lessThanHalfway,
            m.milestone_id = csv.milestone_id,
            m.name = csv.name,
            m.nearFinished = csv.nearFinished,	
            m.nearFuture = csv.nearFuture, 
            m.overHalfway = csv.overHalfway,
            m.presentState = csv.presentState,
            m.property = csv.property,
            m.purpose = csv.purpose,
            m._start = csv._start,
            m._end = csv._end,
            m._type = csv._type,
            m.updated_at = csv.updated_at
        ON MATCH SET m._labels = csv._labels,
            m.effort = csv.effort,
            m.fullHumanWBE = csv.fullHumanWBE,
            m.halfway = csv.halfway,
            m.lessThanHalfway = csv.lessThanHalfway,
            m.milestone_id = csv.milestone_id,
            m.name = csv.name,
            m.nearFinished = csv.nearFinished,	
            m.nearFuture = csv.nearFuture, 
            m.overHalfway = csv.overHalfway,
            m.presentState = csv.presentState,
            m.property = csv.property,
            m.purpose = csv.purpose,
            m._start = csv._start,
            m._end = csv._end,
            m._type = csv._type,
            m.updated_at = csv.updated_at
    `
    const session = driver.session();
    // const updated = new Date(Date.now()).toString();
    // const url = req.body.url;
    // const props = {url, updated};
    
    try {
        // const file = await downloadFromDrive(id);
        const result = await session.run(cypher);
        res.send(result);
        session.close();
    } catch (e) {
        console.log(e);
    }
});

//upload to google drive
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
        //creates file
        const response = await drive.files.create({
            supportsAllDrives: true,
            requestBody,
            media,
            fields: 'id, name',
            supportsAllDrives: true,
            keepRevisionForever: true, 
        })

        //set permission
        const resID = response.data.id;
        const permission = {
            type: 'anyone',
            role: 'reader',
            allowFileDiscovery: false,
        };
        const access = await drive.permissions.create({
            fileId: resID,
            requestBody: permission,
            supportsAllDrives: true,
            supportsTeamDrives: true,
            sendNotificationEmail: false
        })

        console.log('Permission request successful', access.data);
        console.log('drive ID:', response.data.id);
    } catch (e) {
        console.log(e.message, e);
    }
};

const spreadsheet = router;
module.exports = spreadsheet;