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
require('./util/passport.js'); // initializes passport file

const sessOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 60000 }
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) //trust first proxy
    sessOptions.cookie.secure = true; 
        //serve secure cookies
            //might not work, will depend on HTTPS settings
}
app.use(session(sessOptions));
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
        failureRedirect: '/', 
        successRedirect: '/api/users/profile', //can change this route for redirect
        // successRedirect: '/where should users go at login?', //can change this route for redirect
        failureMessage: true 
    })
);