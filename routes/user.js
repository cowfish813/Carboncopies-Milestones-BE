const express = require('express');
const app = express();
const {GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET} = process.env;
const session = require('express-session');
const passport = require('passport');
const router = express.Router();

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));



app.get('/', function(req, res) {
    res.render('pages/auth');
}); //some sort of route


// passport
var userProfile;
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
        clientID: GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: "http://localhost:5001/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done) {
        userProfile=profile;
        return done(null, userProfile);
    }
));
 
app.get('/auth/google', 
    passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/error' }),
    function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
});