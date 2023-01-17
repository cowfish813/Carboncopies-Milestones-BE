const { Router } = require('express');
const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;
const driver = new neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

router.get('/', async (req, res) => {
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
    //single node
    const session = driver.session();
    const cypher = 'MATCH (m:Milestone {milestone_id: $id}) RETURN *';
    const id = req.params.milestone_id;
    console.log(req.params.milestone_id);

    try {
        // const milestone = await session.run(cypher, id);
        // res.json(milestone);
        session.close();
    } catch (err) {
        res.status(404).json(err);
    }
});

router.post('/', async (req, res) => {
    const session = driver.session();
    const cypher = 'CREATE (m:Milestone $props) RETURN m'
    const props = { props: {
        milestone_id: uuidv4(),
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
        date: Date.now(),
        updated_at: Date.now()
    }}

    try {
        const newMilestone = await session.run(cypher, props);
        res.json(newMilestone);
        session.close();
        
    } 
    catch (err) {
        // console.log(err);
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
    } catch (e) {
        console.log(e);
    }
})

router.delete('/all', async (req, res) => { //delete db
    const session = driver.session();
    //clear DB
    const cypher = 'CREATE (m:Milestone $props) RETURN m'

    try {
        
    } catch (e) {
        console.log(e);
    }
})

router.delete('/:milestone_id', async (req, res) => { 
    //delete single milestone + relationships
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
        updated_at: Date.now()
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