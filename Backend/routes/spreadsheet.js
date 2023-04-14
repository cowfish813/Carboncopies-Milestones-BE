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
const csvName = `${Date.now()}ccf${uuidv4()}`;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID, 
    CLIENT_SECRET, 
    REDIRECT_URI,
);
const googleSharedDriveID = '1Spm0zSrUPb4McJjvNylngzWHmJKF8VXy';
    //Shared Drives - Education - Roadmap Vis

oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

// const downloadFromDrive = async (realFileId) => {
//     const auth = new GoogleAuth({
//         scopes: 'https://www.googleapis.com/auth/drive',
//     });
//     const service = google.drive({version: 'v3', auth: oAuth2Client});
//     fileId = realFileId;
//     try {
//         //files.get?
//         const file = await service.files.export({
//             fileId,
//             // alt: 'media',
//             mimeType: 'text/csv'
//         });
//         return file;
//     } catch (err) {
//         console.log(err, 'error');
//         throw err;
//     }
// };

// download from google drive
router.post('/:drive_id', async (req, res) => {
    const id = req.params;
    // console.log(id);
    // const url = await downloadFromDrive('1YHVaZV9jhEGNgsS9qKQbRoMlQqqPhv3n0fAq3ShGQV8');
    const url = `https://docs.google.com/spreadsheets/d/${id.drive_id}/export?format=csv`;
    const updated = new Date(Date.now()).toString();
    const props = {url, updated, uuid: uuidv4()};
    const cypher = `LOAD CSV WITH HEADERS FROM $url AS csv
        WITH csv 
        WHERE csv.milestone_id IS NOT NULL
        MERGE (m:Milestone {milestone_id: csv.milestone_id})
        SET m._labels = csv._labels,
            m.effort = csv.effort,
            m.fullHumanWBE = csv.fullHumanWBE,
            m.halfway = csv.halfway,
            m.lessThanHalfway = csv.lessThanHalfway,
            m.milestone_id = $uuid,
            m.name = csv.name,
            m.nearFinished = csv.nearFinished,	
            m.nearFuture = csv.nearFuture, 
            m.overHalfway = csv.overHalfway,
            m.presentState = csv.presentState,
            m.property = csv.property,
            m.purpose = csv.purpose,
            m.updated_at = $updated
    `
        //how do i deal with relationships?

    const session = driver.session();
    
    try {
        const result = await session.run(cypher, props);
        res.send(result);
        session.close();
    } catch (e) {
        console.log('error:', e);
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