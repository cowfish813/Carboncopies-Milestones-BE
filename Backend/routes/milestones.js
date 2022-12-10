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
});

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
        fullHumanWBE: req.body.fullHumanWBE,
        // next/children: req.body.next,
            //store bigger collection of nodes?
            //

    })

    const milestone = await newMilestone.save()
    try {
        res.json(milestone)
    } catch {
        res.status(404).json(err)
    }
});

router.delete('/:milestone_id',async (req, res) => { //delete whole milestone
    const milestone = await Milestone.findOneAndDelete({_id: req.params.milestone_id})
    try {
        res.json({_id: milestone._id});
    } catch (err) {
        res.status(404).json(err);
    }

    //what if previous or children of node were deleted? 
        //i'll need to programatically patch them out...
});

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
    
    await Milestone.findOneAndUpdate(
        {_id: req.params.milestone_id}, 
        patchedMilestone, 
        { new: true }
    )

    try {
        res.json({_id: milestone._id})
    } catch (err) {
        res.status(404).json(err)
    }

    //what if a child or previous node is deleted?
        // do i check children/previous and make the delete/re-entry for pre-existing?
});

export const milestones = router;