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
        name: req.body.purpose,
        content: req.body.content,
        children: req.body.children,
        previous: req.body.children
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
        .then(milestone => res.json({_id: milestone._id}))
        .catch(err => res.status(404).json(err));
})

router.patch('/:question_id', (req, res) => {
    //delete one relationship(s) in selected node
        // child and/or previous
            // multiple patchjes?
    //change one piece of content

    // Milestone.findOneAndUpdate({_id: req.params.milestone_id})
})

export const milestones = router;