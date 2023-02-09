const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;
const driver = new neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
const axios = require('axios');

// const Milestone = require('../models/milestone');
const fs = require('fs');
const sheetName = `${Date.now()}ccf${uuidv4()}.json`;
// const sheetName = `${Date.now()}ccf${uuidv4()}.csv`;
const path = require('path')


const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const proc = require('process');
const {GoogleAuth, OAuth2Client} = require('google-auth-library');
const { application } = require('express');
const {CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN} = process.env;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';


// const TOKEN_PATH = path.join(proc.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(proc.cwd(), 'credentials.json');
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

// const filePath = path.join(__dirname, '');
const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client
})

const postToDrive = async (name, file) => {
    const config =  {
        headers: {
            "Content-Type": 'application/json',
        }
    }
    const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media';

    try {
        const response = await drive.files.create({
            requestBody: {
                name: name,
                mimeType: 'application/json', //mimetype package can identify file
            },
            media: {
                mimeType: 'aplpication/json',
                body: JSON.stringify(file) //fs.createReadStream() //provide filepath. whats an alternative?
            }
        })
        console.log(response.data);
    } catch (e) {
        console.log(e.message);
    }
}


router.get('/', async (req, res) => {
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
        console.log(e, 'failed GET sheets');
    }
})




// file:///1674858879743ccf6f82d3f2-00f4-492c-9f0f-9aa1e9249f83.csv
//test link:  https://docs.google.com/spreadsheets/d/1jGbsFhfOIl375_EaGSjb8Ur9sbhvO9UURqdDJ6QoRGc/edit?usp=sharing
router.post('/', async (req, res) => {
    //import csv
        //turn FROM "link" to a param from req
            //POST to neo4j
            //GET from google
    
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
        WITH 'https://drive.google.com/file/d/1xAr3RifsXGv_hjQ0nDNvpdVnq5V2FiB8/view?usp=sharing' AS url
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
    `

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
})

const spreadsheet = router;
module.exports = spreadsheet;