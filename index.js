const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const milestones = require('./routes/milestones.js');
const spreadsheet = require('./routes/spreadsheet.js');
const user = require('./routes/users.js')
const app = express();
const cors = require('cors');
app.use(cors());
const { auth } = require('express-openid-connect');

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use(express.json());


const { 
    NEO4J_URI, 
    NEO4J_USERNAME, 
    NEO4J_PASSWORD, 
    CLIENT_ID, 
    CLIENT_SECRET, 
    REFRESH_TOKEN,
    GOOGLE_SHARED_DRIVE_ID,
    AUTH0_CLIENT_SECRET,
    AUTH0_CLIENT_ID,
    issuerBaseURL
    } = process.env;

    // http://localhost:3000/
app.use(
    auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: 'http://localhost:5001/', //check line 30 of .env file
    baseURL: 'http://localhost:5001/', 
    clientID: AUTH0_CLIENT_ID,
    secret: AUTH0_CLIENT_SECRET,
    issuerBaseURL
    // secret: '26d04d1a7f7bf7ce0f992070e9c9cdecd0790805ce252da050670da43e707d43' 
        //generated from openssl rand -hex 32 in command line.
    })
);

app.use('/api/milestones', milestones);
app.use('/api/spreadsheet', spreadsheet);
app.use('/api/user', user);

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});

