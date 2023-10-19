const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const milestones = require('./routes/milestones.js');
const spreadsheet = require('./routes/spreadsheet.js');
const users = require('./routes/users.js');
const app = express();
const cors = require('cors');
app.use(cors());

const session = require('express-session');
const passport = require('passport');
require('./passport');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use(express.json());
app.use('/api/milestones', milestones);
app.use('/api/spreadsheet', spreadsheet);
app.use('/api/users', users);

// Callback after Google has authenticated the user. 
    //route corresponds to passport callbackURL
app.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/login', 
        successRedirect: '/api/users/', //can change this route for redirect
        failureMessage: true 
    })
);