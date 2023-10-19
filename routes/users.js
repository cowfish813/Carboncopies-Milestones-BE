const express = require('express');
const app = express();
const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } = process.env;
const session = require('express-session');
const passport = require('../passport');
const router = express.Router();
const User = require('../models/user');

// Initiate the Google OAuth flow
router.get('/auth/google', passport.authenticate('google', 
    { scope: ['profile', 'email'] }));

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