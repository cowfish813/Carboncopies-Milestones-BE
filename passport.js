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
        const email = profile.emails[0].value;
        const verified = profile.emails[0].verified;
        const emailExtension = email.split('@')[1] === 'carboncopies.org';
        if (verified && emailExtension) { 
                //can user auth hinge on this single 'if' statement?
            // what else is done?
                //create user via cypher?
            userProfile = profile;
            return done(null, userProfile);
        } else {
            console.log('do what?');
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;