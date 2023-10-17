const express = require('express');
const app = express();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET} = process.env;

let userProfile;
app.use(passport.initialize());
app.use(passport.session());

// app.set('view engine', 'ejs');
// app.get('/success', (req, res) => res.send(userProfile));
// app.get('/error', (req, res) => res.send("error logging in"));

passport.use(new GoogleStrategy({
        clientID: GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: "http://localhost:5001/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
        console.log(accessToken);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;