const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const router = express.Router();
const neo4j = require('neo4j-driver');
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;
const driver = new neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
const session = driver.session();

router.get('/', async (req, res) => {
    // const milestones = await Milestone.findAll();
    // console.log('get', milestones);
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

    const newMilestone = {
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
    }
    const cypher = ``;
    // await console.log(newMilestone.get('purpose'));
    try {
        // const milestone = await newMilestone.save();
        // res.json(milestone);
        const newMilestone = await session.run(cypher);
        session.close();
    } catch (err) {
        // console.log(err);
        res.status(404).json(err);
    }
});

router.delete('/all', async (req, res) => { //delete db
    // const milestones = await Milestone.findAll();
    // await milestones.deleteAll();
})

router.delete('/:milestone_id',async (req, res) => { //delete single milestone
    // const milestone = await Milestone.findByID({_id: req.params.milestone_id});

    // if (milestone) {
    //     // await milestone.delete();
    // } else {
    //     // return 'Server Message: milestone not found';
    // }

    try {
        // res.json({_id: milestone._id});
    } catch (err) {
        res.status(404).json(err);
    }
});

router.patch('/:milestone_id', async (req, res) => {
    // const milestone = await Milestone.findByID({_id: req.params.milestone_id});
    // milestone.purpose = req.body.purpose,
    // milestone.property = req.body.property,
    // milestone.effort = req.body.effort,
    // milestone.presentState = req.body.presentState,
    // milestone.nearFuture = req.body.nearFuture,
    // milestone.lessThanHalfway = req.body.lessThanHalfway,
    // milestone.halfway = req.body.halfway,
    // milestone.overHalfway = req.body.overHalfway,
    // milestone.nearFinished = req.body.nearFinished,
    // milestone.fullHumanWBE = req.body.fullHumanWBE,
    // milestone.updated_at = Date.now()
    // await milestone.save();

    try {
        // res.json({_id: milestone._id})
    } catch (err) {
        res.status(404).json(err)
    }
});

const milestones = router;
module.exports = milestones;
