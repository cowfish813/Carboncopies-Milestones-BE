import express from 'express';
import {Milestone} from '../models/milestone.js';
const router = express.Router();

router.get('/', (req, res) => {
    Milestone.find()
        .then(milestones => {
            console.log("work");
            res.json(milestones)})
        .catch(err => {
            console.log("err");
            res.status(404).json(err)});
})

router.post('/', (req, res) => {
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
    console.log(newMilestone);

    newMilestone.save()
        .then(milestone => res.json(milestone))
        .catch(err => {
            console.log('err');
            res.status(404).json(err)});
})

router.delete('/:milestone_id', (req, res) => { //delete whole milestone
    Milestone.findOneAndDelete({_id: req.params.milestone_id})
        .then(milestone => {
            console.log(`${milestone} DELETED`);
            res.json({_id: milestone._id})
        })
        .catch(err => res.status(404).json(err));
})

router.patch('/:milestone_id', (req, res) => {
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

    console.log(req.params.milestone_id)
    
    Milestone
        .findOneAndUpdate(
            {_id: req.params.milestone_id}, 
            patchedMilestone, 
            { new: true })
        .then(pms => {
            console.log(pms, 'successful?')
            res.json({_id: milestone._id})
        })
        .catch(err => res.status(404).json(err));

})

export const milestones = router;