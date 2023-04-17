const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const Milestone = require('../models/milestone');

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;
const driver = new neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

router.get('/', async  (req, res) => { // ALL NODES with relationship: PRECEDES
    const cypher = 'MATCH (m: Milestone)-[r:PRECEDES]->(n:Milestone) RETURN m,r,n';
    const session = driver.session();
    try {
        const result = await session.run(cypher);
        const milestoneArr = [];
        result.records.forEach(record => {
            milestoneArr.push(record._fields)
        })
        res.send(milestoneArr);
        session.close();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/all', async (req, res) => { // ALL nodes
    const session = driver.session();
    const cypher = 'MATCH (n) RETURN *';
    try {
        const milestones = await session.run(cypher);
        res.json(milestones);
        session.close();
    } catch (err) {
        res.status(404).json(err);
    }
});

router.get('/:milestone_id', async (req, res) => { 
    // single node chain of relationships
    const session = driver.session();
    const cypher = "MATCH m=(:Milestone { milestone_id:$id })-[*]->() RETURN m";
    const id = {id: req.params.milestone_id};

    try {
        const milestone = await session.run(cypher, id);
        res.json(milestone);
        session.close();
    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
});

router.post('/', async (req, res) => { //create single Milestone
    const session = driver.session();
    const cypher = 'CREATE (m:Milestone $props) RETURN m';
    const newMilestone = new Milestone (req.body);
    const props = {props: newMilestone};

    try {
        const result = await session.run(cypher, props);
        res.json(result);
        session.close();
    } 
    catch (err) {
        res.status(404).json(err);
    }
});

router.post('/:id', async (req, res) => { //create single Milestone AND relationship
    const session = driver.session();

    const cypher = `MATCH (existing:Milestone { milestone_id:$id })
        CREATE (newMilestone:Milestone $props)
        MERGE (newMilestone)-[:PRECEDES]->(existing)
        RETURN newMilestone, existing`

    const newMilestone = new Milestone (req.body);
    const id = req.params.id;
    const props = {props: newMilestone, id:id};
    console.log(props, id, newMilestone)
    try {
        const result = await session.run(cypher, props);
        res.json(result);
        session.close();
    } 
    catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
});

router.patch('/:id1/:id2', async (req, res) => { 
    // same tier relationships
        //the FIRST wildcard is the PARENT node
    const session = driver.session();
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    const cypher = `
        MATCH (a:Milestone), (b:Milestone)
        WHERE a.milestone_id = $id1 AND b.milestone_id = $id2
        MERGE (a)-[r:PRECEDES]->(b)
        RETURN a,b`;

    try {
        const addedRelationship = await session.run(cypher, {id1, id2});
        res.json(addedRelationship);
        session.close();
    } catch (err) {
        console.log(err);
    }
})

router.delete('/all', async (req, res) => { //delete db
    const session = driver.session();
    try {
        session.close();
    } catch (err) {
        console.log(err);
    }
})

router.delete('/rel/:id1/:id2', async (req, res) => {
    //delete relationship
    const session = driver.session();
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    const cypher = `
        MATCH (a: Milestone)-[r:PRECEDES]->(b: Milestone)
        WHERE a.milestone_id = $id1 AND b.milestone_id = $id2
        DELETE r`;

    try {
        const rel = await session.run(cypher, {id1, id2});
        res.json(rel);
        console.log('rel', rel)
        session.close();
    } catch (err) {
        console.log(err);
    }
})

router.delete('/:milestone_id', async (req, res) => { 
    //delete single milestone relationships
    const session = driver.session();
    const cypher = `MATCH (m {milestone_id: $id}) DETACH DELETE m`;
    const id = req.params.milestone_id;
    try {
        const newMilestone = await session.run(cypher, {id});
        res.json(newMilestone);
        session.close();
    } catch (err) {
        res.status(404).json(err);
    }
});

router.patch('/:milestone_id', async (req, res) => {
    //update single milestone properties - NO relationships
    const session = driver.session();
    const cypher = `MATCH (m {milestone_id: $id}) 
        SET m.purpose = $purpose
        SET m.property = $property
        SET m.effort = $effort
        SET m.presentState = $presentState
        SET m.nearFuture = $nearFuture
        SET m.lessThanHalfway = $lessThanHalfway
        SET m.halfway = $halfway
        SET m.overHalfway = $overHalfway
        SET m.nearFinished = $nearFinished
        SET m.fullHumanWBE = $fullHumanWBE
        SET m.updated_at = $updated_at
        RETURN m.milestone_id`;

    const props = { 
        id: req.params.milestone_id,
        purpose: req.body.purpose,
        property: req.body.property,
        effort: req.body.effort,
        presentState: req.body.presentState,
        nearFuture: req.body.nearFuture,
        lessThanHalfway: req.body.lessThanHalfway,
        halfway: req.body.halfway,
        overHalfway: req.body.overHalfway,
        nearFinished: req.body.nearFinished,
        fullHumanWBE: req.body.fullHumanWBE,
        updated_at: new Date(Date.now()).toString()
    }
    
    try {
        const newMilestone = await session.run(cypher, props);
        res.json(newMilestone);
        session.close();
    } catch (err) {
        res.status(404).json(err)
    }
});

const milestones = router;
module.exports = milestones;