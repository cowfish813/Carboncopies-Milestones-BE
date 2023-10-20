const express = require('express');
const passport = require('../util/passport');
const router = express.Router();
const neo4j = require('neo4j-driver');

// Initiate the Google OAuth flow
router.get('/auth/google', passport.authenticate('google', 
    { scope: ['profile', 'email'] }));

//retrieve profile information
router.get('/profile', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const id = req.session.passport.user.id
            const displayName = req.session.passport.user.displayName
            const email = req.session.passport.user.emails[0].value
            const photos = req.session.passport.user.photos
            const profile = {id, displayName, email, photos};
            res.status(200).json(profile)
        } 
    } catch (err) {
        res.status(404).json(err);
    }
})

//log out
router.delete('/logout', (req, res, next) => {
    req.logOut();
    req.session.destroy();
    res.send('Logout Succesful');
});

router.post('/', async (req, res) => {

})

const users = router;
module.exports = users;