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
}

router.get('/google', () => { // Google Auth consent screen route
  console.log('test')
  passport.authenticate('google', {
    scope:
      ['email', 'profile']
  })
})

// 
// Call back route
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    (req, res) => {
        res.redirect('/success');
    }
);

// failed route if the authentication fails
router.get("/failed", (req, res) => {
    console.log('User is not authenticated');
    res.send("Failed");
});

// Success route if the authentication is successful
router.get("/success", isLoggedIn, (req, res) => {
    console.log('You are logged in');
    res.send(`Welcome ${req.user.displayName}`);
});

// 
router.post('/', (req, res) => { //login
  //force logout if not validated?
})

// protected route. obtain user info(?)
router.get('/current', (req, res) => {

})

//log out
router.delete('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
        console.log('Error while destroying session:', err);
    } else {
        req.logout(() => {
            console.log('You are logged out');
            res.redirect('/home');
        });
    }
  });
})
module.exports = router;

// app.get('/auth/google', 
//     passport.authenticate('google', { scope : ['profile', 'email'] }));

// app.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/error' }),
//     function(req, res) {
//     // Successful authentication, redirect success.
//     res.redirect('/success');
// });