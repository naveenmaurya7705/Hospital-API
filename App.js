const express = require('express');
const app = express();

const port = 8000;
const db = require('./config/mongoose');

// Used for Session Cookie
const passport = require('passport');
const passportJWT = require('./config/passport-jwt-strategy');

// Middleware to parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON data (for API requests)
app.use(express.json());  // Added this line to handle JSON payloads

// Initialize Passport
app.use(passport.initialize());

// Use express router for all routes
app.use('/', require('./routes/index'));

// Start the server
app.listen(port, function (error) {
    if (error) {
        console.log(`Error in running the Server. Error is : ${error}`);
        return;
    }
    console.log(`Server is up and running on the port: ${port}`);
});
