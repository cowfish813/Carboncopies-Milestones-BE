const express = require('express');
const app = express();
const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } = process.env;
const session = require('express-session');
const passport = require('../passport');
const router = express.Router();
const User = require('../models/user');


// Middleware used in protected routes to check if the user has been authenticated
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
} //How is this used? ^^copy pasta from another link

router.get('/loggedin', (req, res, next) => {

    console.log(req);
    if (req.user) {
        next();
    } else {
        console.log('nope');
        res.sendStatus(401);
    }
})

// Initiate the Google OAuth flow
router.get('/auth/google', passport.authenticate('google', 
    { scope: ['profile', 'email'] }));

//log out
    // router.delete('/logout', function (req, res) {
//         req.logOut();
//         res.redirect('/');
//     });

module.exports = router;