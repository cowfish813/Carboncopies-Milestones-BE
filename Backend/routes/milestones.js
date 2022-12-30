const express = require('express');
// const Milestone = require('./models/milestone.js');
const Neode = require('neode');
const path = require('path');
const { fileURLToPath } = require('url');
const instance = Neode.fromEnv();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const Milestone = instance.withDirectory(__dirname +'/models');
const router = express.Router();

router.get('/', async (req, res) => {
    // const milestones = await Milestone.findAll();
    // console.log('get', milestones);
    try {
        // res.json(milestones)
    } catch (err) {
        res.status(404).json(err);
    }
});

router.post('/', async (req, res) => {
    const newMilestone = await instance.create('Milestone', {
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
    })
    
    await console.log(newMilestone.get('purpose'));
    try {
        // const milestone = await newMilestone.save();
        // res.json(milestone);
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
