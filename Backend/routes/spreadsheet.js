const { Router, application } = require('express');
const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;
const driver = new neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

const csv = require('fast-csv');
const fs = require('fs');
const sheetName = `${Date.now()}ccf${uuidv4()}.csv`;


router.get('/', async (req, res) => {
    //export whole db
    const cypher = `
        CALL apoc.export.csv.all(null, {stream:true})
        YIELD file, nodes, relationships, properties, data
        RETURN file, nodes, relationships, properties, data
        `
    const session = driver.session();
    try {
        const result = await session.run(cypher);
        const ws = fs.createWriteStream(sheetName);
        csv.write(result.records.map(record => record._fields), {headers: true}).pipe(ws);
        res.send(result);
        session.close();
    } catch (e) {
        console.log(e);
    }
})

router.post('/', async (req, res) => {
    //import csv
        //replace db?

    
})

const spreadsheet = router;
module.exports = spreadsheet;