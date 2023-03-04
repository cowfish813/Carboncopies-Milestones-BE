const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
const {google} = require('googleapis');
const { 
    NEO4J_URI, 
    NEO4J_USERNAME, 
    NEO4J_PASSWORD, 
    CLIENT_ID, 
    CLIENT_SECRET, 
    REFRESH_TOKEN 
    } = process.env;
const driver = new neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
const sheetName = `${Date.now()}ccf${uuidv4()}.json`;
// const sheetName = `${Date.now()}ccf${uuidv4()}.csv`;

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
    const sheet = google.sheet(googleAuth);

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

const uploadToNeo4j = async (fileId) => {
    const stream = await downloadFromDrive(drive, fileId);
    stream(on("data", chunk => {
        const data = JSON.parse(chunk.toString());
    }))
};

router.post('/', async (req, res) => {
    // const cypher = `
    //     LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/1nAi72QiKLOofV9JOByAXezfVDJjC3WqEcd4x2r69bM0/edit#gid=0' AS row
    //     CREATE (:MILESTONE {
    //         milestone_id: row.milestone_id,
    //         purpose : row.purpose,
    //         property : row.property,
    //         effort : row.effort,
    //         presentState : row.presentState,
    //         nearFuture : row.nearFuture,
    //         lessThanHalfway : row.lessThanHalfway,
    //         halfway : row.halfway,
    //         overHalfway : row.overHalfway,
    //         nearFinished : row.nearFinished,
    //         fullHumanWBE : row.fullHumanWBE,
    //         created_at : row.created_at,
    //         updated_at: $updated
    //     })`;

    const cypher = `
        WITH 'https://drive.google.com/file/d/1EqeUdPR45qIALvF4Fr4dit_KYEAuM3r2/view?usp=share_link' AS url
        CALL apoc.load.json(url) YIELD value
        UNWIND value.data AS data
            CREATE (m:MILESTONE {
            milestone_id: data.milestone_id,
            purpose : data.purpose,
            property : data.property,
            effort : data.effort,
            presentState : data.presentState,
            nearFuture : data.nearFuture,
            lessThanHalfway : data.lessThanHalfway,
            halfway : data.halfway,
            overHalfway : data.overHalfway,
            nearFinished : data.nearFinished,
            fullHumanWBE : data.fullHumanWBE,
            created_at : data.created_at,
            updated_at: $updated
        })
        SET m += data
    `;

    const session = driver.session();
    const updated = new Date(Date.now()).toString();
    const url = req.body.url;
    const props = {url, updated};

    try {
        // await session.run("CALL dbms.security.setConfigValue('dbms.security.allow_csv_import_from_file_urls', true)");
        const result = await session.run(cypher, props);

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