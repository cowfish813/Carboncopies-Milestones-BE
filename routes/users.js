const { auth, requiresAuth } = require('express-openid-connect');
const express = require('express');
const router = express.Router();
const app = express();
const neo4j = require('neo4j-driver');
const User = require('../models/user');
const { AUTH0_CLIENT_SECRET,
        AUTH0_CLIENT_ID,
        issuerBaseURL
    } = process.env;

const authentication = {
    authRequired: false,
    auth0Logout: true,
    // issuerBaseURL: 'http://localhost:5001/', //check line 30 of .env file
    baseURL: 'http://localhost:5001/', 
    clientID: AUTH0_CLIENT_ID,
    secret: AUTH0_CLIENT_SECRET,
    issuerBaseURL
    // secret: '26d04d1a7f7bf7ce0f992070e9c9cdecd0790805ce252da050670da43e707d43' 
        //generated from openssl rand -hex 32 in command line.
};

app.use(auth(authentication));

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


// router.get('/:user_id', async (req, res) => { 
//     //single user
//     const session = driver.session();
//     const cypher = "MATCH u = (:User { user_id:$id })-[*]->() RETURN u";
//     const id = {id: req.params.milestone_id};

//     try {
//         const user = await session.run(cypher, id);
//         res.json(user);
//         session.close();
//     } catch (err) {
//         console.log(err);
//         res.status(404).json(err);
//     }
// });

router.get('/', (req, res, next) => {
    console.log(JSON.stringify(req.oidc.isAuthenticated()))
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
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

    console.log('working')
    try {
        // const user = req.oidc
        // Create the (:User)-[:HAS_ENROLMENT]->(:Enrolment)-[:FOR_COURSE]->(c) pattern in Neo4j
        // const enrolment = await enrolInCourse(req.params.course, user)
        // const result = await session.run(cypher, props);
        // res.json(result);
        // Redirect the user to the first lesson
        // res.redirect(enrolment.next.link)
        // console.log(user, req.oidc);
        session.close();
    } catch (e) {
        next(e);
        console.log(e)
    }
})

router.delete('/', async (req, res) => {
    //log out of session
})


const user = router;
module.exports = user;
