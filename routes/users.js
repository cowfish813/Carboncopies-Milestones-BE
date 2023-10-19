const express = require('express');
const app = express();
const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } = process.env;
const session = require('express-session');
const passport = require('../passport');
const router = express.Router();
// const User = require('../models/user');

// Initiate the Google OAuth flow
router.get('/auth/google', passport.authenticate('google', 
    { scope: ['profile', 'email'] }));

router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        const id = req.session.passport.user.id
        const displayName = req.session.passport.user.displayName
        const email = req.session.passport.user.emails[0].value
        const photos = req.session.passport.user.photos
        const result = {id, displayName, email, photos};
        res.send(result);
    } else {
        console.log('fail');
    }
})

//log out
router.delete('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        } else {
            res.redirect('/');
        }
    });
});

const users = router;
module.exports = users;