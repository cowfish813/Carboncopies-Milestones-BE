const { requiresAuth } = require('express-openid-connect');
const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const User = require('../models/user');


// An oidc object containing the user is added to `req` by express-openid-connect
// router.post('/:course/enrol', requiresAuth(), async (req, res, next) => {
//     try {
//       const id = req.oidc.user
//       // Create the (:User)-[:HAS_ENROLMENT]->(:Enrolment)-[:FOR_COURSE]->(c) pattern in Neo4j
//       const enrolment = await enrolInCourse(req.params.course, user)
//       // Redirect the user to the first lesson
//       res.redirect(enrolment.next.link)
//     }
//     catch(e) {
//       next(e)
//     }
//   }
// )

// app.get('/profile', requiresAuth(), (req, res) => {
//     res.send(JSON.stringify(req.oidc.user));
// });


router.get('/:user_id', async (req, res) => { 
    //single user
    const session = driver.session();
    const cypher = "MATCH u = (:User { user_id:$id })-[*]->() RETURN u";
    const id = {id: req.params.milestone_id};

    try {
        const user = await session.run(cypher, id);
        res.json(user);
        session.close();
    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
});


router.post('/', requiresAuth(), async (req, res, next) => {
    //return session token(?)

    const session = driver.session();
    // const cypher = 'CREATE (m:Milestone $props) RETURN m';
    // const newMilestone = new Milestone (req.body);
    // const props = {props: newMilestone};

    // try {

    // } 
    // catch (err) {
    //     res.status(404).json(err);
    // }


    try {
        const user = req.oidc.user
        // Create the (:User)-[:HAS_ENROLMENT]->(:Enrolment)-[:FOR_COURSE]->(c) pattern in Neo4j
        // const enrolment = await enrolInCourse(req.params.course, user)
        // const result = await session.run(cypher, props);
        // res.json(result);
        // Redirect the user to the first lesson
        // res.redirect(enrolment.next.link)
        console.log(user, req.oidc);
        session.close();
    } catch (e) {
        next(e);
    }
})

router.delete('/', async (req, res) => {
    //log out of session
})


const user = router;
module.exports = user;
