const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
const Milestone = require('../models/milestone');
const {google} = require('googleapis');
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
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID, 
    CLIENT_SECRET, 
    REDIRECT_URI,
);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
const googleSharedDriveID = '1Spm0zSrUPb4McJjvNylngzWHmJKF8VXy';
    //Shared Drives - Education - Roadmap Vis

// download from google drive
router.post('/:drive_id/', async (req, res) => {
    const id = req.params.drive_id;
    const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
    const props = {url, uuid: uuidv4()};
    const cypherCSV = `LOAD CSV WITH HEADERS FROM $url AS csv
        WITH csv 
        WHERE csv.milestone_id IS NOT NULL
        MERGE (m:Milestone {milestone_id: csv.milestone_id})
        SET m.effort = csv.effort,
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
            m.updated_at = datetime()
    ` //may require additional properties on spreadsheet header
        //avoid anything that begins with "_" as a header. ex. _id, _labels

    const cypherRelationship = `
        LOAD CSV WITH HEADERS FROM $url AS csv
        WITH csv 
        MATCH (m1:Milestone), (m2:Milestone)
        WHERE csv._start IS NOT NULL
            AND csv._end IS NOT NULL
            AND csv._type IS NOT NULL
            AND ID(m1) = toInteger(csv._start)
            AND ID(m2) = toInteger(csv._end)
        CALL apoc.merge.relationship(
            m1, 
            csv._type, 
            {}, 
            {created_at: datetime()}, 
            m2, {updated_at: datetime()}
        )
        YIELD rel
        RETURN rel
    `

    const session = driver.session();
    
    try {
        const result = await session.run(cypherCSV, props);
        const rel = await session.run(cypherRelationship, props);
        res.send({result, rel})

        session.close();
    } catch (e) {
        console.log('error:', e);
    }
}); //can I assign new milestone_id? currently have bug that assigns the same id for all new nodes
        //with null node, can i call for a new milestone node instead by importing the model?

//upload to google drive
router.get('/csv', async (req, res) => {
    const csvName = `${Date.now()}ccf${uuidv4()}.csv`;
    const cypher = ` 
    CALL apoc.export.csv.all(null, {stream: true})
        YIELD file, nodes, relationships, properties, data
        RETURN file, nodes, relationships, properties, data
        `;
    const session = driver.session();
    try {
        const result = await session.run(cypher);    
        const csvID = await csvToDrive(csvName, (result.records.map(record => record._fields)[0][4]));

        res.send(csvID.data.id);
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
        return response;
    } catch (e) {
        console.log(e.message,'CSVTODRIVE FUNC ERROR' ,e);
    }
};

const spreadsheet = router;
module.exports = spreadsheet;