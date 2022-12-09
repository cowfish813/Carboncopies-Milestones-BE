import express from 'express';
import { Milestone } from '../models/milestone.js';
const router = express.Router();

router.get('/', async (req, res) => {
    const milestones = await Milestone.find()

    try {
        res.json(milestones)
    } catch (err) {
        res.status(404).json(err);
    }
})

router.post('/', async (req, res) => {
    const newMilestone = new Milestone({
        purpose: req.body.purpose,
        content: req.body.content,
        children: req.body.children,
        previous: req.body.previous,
        presentState: req.body.presentState,
        nearFuture: req.body.nearFuture,
        lessThanHalfway: req.body.lessThanHalfway,
        halfway: req.body.halfway,
        overHalfway: req.body.overHalfway,
        nearFinished: req.body.nearFinished,
        fullHumanWBE: req.body.fullHumanWBE
    })

    const milestone = await newMilestone.save()
    try {
        res.json(milestone)
    } catch {
        res.status(404).json(err)
    }
})

router.delete('/:milestone_id',async (req, res) => { //delete whole milestone
    const milestone = await Milestone.findOneAndDelete({_id: req.params.milestone_id})
    try {
        res.json({_id: milestone._id});
    } catch (err) {
        res.status(404).json(err);
    }

    //what if parent was deleted? 
        //i'll6392859e553e5e3c810dd80d need to programatically patch them out...
})

router.patch('/:milestone_id', async (req, res) => {
    const patchedMilestone = {
        purpose: req.body.purpose,
        content: req.body.content,
        children: req.body.children,
        previous: req.body.previous,
        presentState: req.body.presentState,
        nearFuture: req.body.nearFuture,
        lessThanHalfway: req.body.lessThanHalfway,
        halfway: req.body.halfway,
        overHalfway: req.body.overHalfway,
        nearFinished: req.body.nearFinished,
        fullHumanWBE: req.body.fullHumanWBE
    }
    
    const patched = await Milestone
        .findOneAndUpdate(
            {_id: req.params.milestone_id}, 
            patchedMilestone, 
            { new: true })

    try {
        res.json({_id: milestone._id})
    } catch (err) {
        res.status(404).json(err)
    }
})

export const milestones = router;