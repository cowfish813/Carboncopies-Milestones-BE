const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const milestones = require('./routes/milestones.js');
const spreadsheet = require('./routes/spreadsheet.js');
const user = require('./routes/users.js')
const app = express();
const cors = require('cors');
app.use(cors());
const { auth, requiresAuth } = require('express-openid-connect');

const port = process.env.PORT || 5001;
app.use(express.json());

const { 
    AUTH0_CLIENT_SECRET,
    AUTH0_CLIENT_ID,
    issuerBaseURL
    } = process.env;

const config = {
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: 'http://localhost:5001/', //check line 30 of .env file
    baseURL: 'http://localhost:5001/', 
    clientID: AUTH0_CLIENT_ID,
    secret: AUTH0_CLIENT_SECRET,
    issuerBaseURL
    };

app.use(auth(config));
app.use('/api/milestones', milestones);
app.use('/api/spreadsheet', spreadsheet);
app.use('/api/user', user);

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
