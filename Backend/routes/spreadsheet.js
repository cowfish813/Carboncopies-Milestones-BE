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
        const file = await service.files.get({
            fileId,
            alt: 'media',
            mimeType: 'application/vnd.google-apps.spreadsheet'
        });
        console.log(file, 'stuff')
        return file;
    } catch (err) {
    // TODO(developer) - Handle error
        console.log(err, 'error');
        throw err;
    }
};

// download from google drive
router.post('/', async (req, res) => {
    const id = '1Cg3Xeo2xgVyqnB-xEu0o9nJtqMe5vSuJZ95d0yQtcCA';
    const id2 = '1ofxhIiuOzNQ5BTEFINDpL-x6DbmO17MLmZUnAzP9asc';
    const file = await downloadFromDrive(id);
    const file2 = await downloadFromDrive(id2);
    // const cypher = `
    // LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/1ltaLzU6USZpaNilNad0CTflIqMduIOZ-nrp6aevIDeg/export?format=csv' AS csv
    // fieldterminator ','
    // MERGE (m:MILESTONE {_id: csv._id})
    // `;
    
    // const session = driver.session();
    // const updated = new Date(Date.now()).toString();
    // const url = req.body.url;
    // const props = {url, updated};
    
    try {
        // console.log("stuff", file, 'hello');
        // const result = await session.run(cypher);
        // console.log(result)
        // res.send(result);
        res.send(file);
    } catch (e) {
        console.log('world', e);
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