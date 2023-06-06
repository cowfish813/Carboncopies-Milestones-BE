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
app.use('/api/milestones', milestones);
app.use('/api/spreadsheet', spreadsheet);
app.use('/api/user', user);

const { 
    NEO4J_URI, 
    NEO4J_USERNAME, 
    NEO4J_PASSWORD, 
    CLIENT_ID, 
    CLIENT_SECRET, 
    REFRESH_TOKEN,
    GOOGLE_SHARED_DRIVE_ID,
    AUTH0_CLIENT_SECRET,
    AUTH0_CLIENT_ID
    } = process.env;

    // http://localhost:3000/
app.use(
    auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: 'http://localhost:5001/',
    baseURL: 'http://localhost:5001/',
    clientID: AUTH0_CLIENT_ID,
    secret: AUTH0_CLIENT_SECRET
    })
);

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});