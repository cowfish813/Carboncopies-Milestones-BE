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

    const newMilestone = await session.run(cypher, props);
    try {
        res.json(newMilestone);
        session.close();
        
    } 
    catch (err) {
        // console.log(err);
        res.status(404).json(err);
    }
});

router.delete('/all', async (req, res) => { //delete db
    const session = driver.session();

    // const milestones = await Milestone.findAll();
    // await milestones.deleteAll();
})

router.delete('/:milestone_id',async (req, res) => { //delete single milestone
    const session = driver.session();

    // const milestone = await Milestone.findByID({_id: req.params.milestone_id});

    // if (milestone) {
    //     // await milestone.delete();
    // } else {
    //     // return 'Server Message: milestone not found';
    // }

    try {
        // res.json({_id: milestone._id});
        session.close();
    } catch (err) {
        res.status(404).json(err);
    }
});

router.patch('/:milestone_id', async (req, res) => {
    const session = driver.session();
    const cypher1 = '';
    const cypher = 'MATCH (m:Milestone {id:$props.milestone_id}) WHERE milestone_id = $milestone_id  RETURN m.milestone_id';
    const props = { props: {
        milestone_id: req.params.milestone_id,
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
    }}

    const newMilestone = await session.run(cypher, props);

    try {
        res.json(newMilestone);
        // res.json({_id: milestone._id})
        session.close();
    } catch (err) {
        res.status(404).json(err)
    }
});

const milestones = router;
module.exports = milestones;
