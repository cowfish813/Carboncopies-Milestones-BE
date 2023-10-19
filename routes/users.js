const express = require('express');
const passport = require('../passport');
const router = express.Router();

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
            const result = {id, displayName, email, photos};
            res.send(result);
        } 
    } catch (err) {
        console.log('fail');
        res.status(404).json(err);
        console.log(res);
    }
})

//log out
router.delete('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

const users = router;
module.exports = users;