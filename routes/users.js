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

// Initiate the Google OAuth flow
router.get('/auth/google', passport.authenticate('google', 
    { scope: ['profile', 'email'] }));


// Callback after Google has authenticated the user
app.get('/auth/google/callback', 
    passport.authenticate('google', {
        
        successRedirect: '/profile',
        failureRedirect: '/fail'
    })
);

router.delete('/logout', function (req, res) {
        req.logOut();
        res.redirect('/');
    });
// router.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/error' }),
//     (req, res) => {
//         console.log("hello authentication(?)");
//         // Successful authentication, redirect to success route
//         res.redirect('/success');
//     });

// router.get('/auth/google', async (q_, s_) => { // Google Auth consent screen route
// //   console.log('test')
//   passport.authenticate('google', {
//     scope:
//       ['email', 'profile']
//   })
  
//   try {
//     console.log('hello', passport)
//     // console.log(res);
//     // res.send(res);
    
//   } catch (err) {
//     console.log(err)
//   }
// })

// // Call back route. console log says this should run next 
// // but how do i make that work?

// app.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/error' }),
//     function(req, res) {
//     // Successful authentication, redirect success.
//     console.log('hmmm?');
//     res.redirect('/success');
// });
// // router.get('/google/callback',
// //     passport.authenticate('google', {
// //         failureRedirect: '/failed',
// //     }),
// //     (req, res) => {
// //         res.redirect('/success');
// //     }
// // );

// // failed route if the authentication fails
// router.get("/failed", async (req, res) => {
//     console.log('User is not authenticated');
//     res.send("Failed");
// });

// // Success route if the authentication is successful
// router.get("/success", isLoggedIn, (req, res) => {
//     console.log('You are logged in');
//     res.send(`Welcome ${req.user.displayName}`);
// });

// // 
// router.post('/', async (req, res) => { //login
//   //force logout if not validated?
// })

// // protected route. obtain user info(?)
// router.get('/current', async (req, res) => {

// })

// //log out
// router.delete('/logout', async (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//         console.log('Error while destroying session:', err);
//     } else {
//         req.logout(() => {
//             console.log('You are logged out');
//             res.redirect('/home');
//         });
//     }
//   });
// })

module.exports = router;

// app.get('/auth/google', 
//     passport.authenticate('google', { scope : ['profile', 'email'] }));

// app.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/error' }),
//     function(req, res) {
//     // Successful authentication, redirect success.
//     res.redirect('/success');
// });