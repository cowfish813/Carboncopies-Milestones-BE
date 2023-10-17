const express = require('express');
const app = express();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET} = process.env;
let userProfile;
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
        clientID: GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: "http://localhost:5001/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done) {
        console.log(profile);

        userProfile = profile;
        return done(null, userProfile);
    }
));

passport.serializeUser(function(user, done) {
    console.log('serializing user');
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('deserializing user');
    done(null, user);
});

module.exports = passport;