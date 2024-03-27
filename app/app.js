const express = require('express');
const app = express();
//const cors = require('cors')

const authentication = require('./authentication.js');
const authenticationAdmin = require('./authenticationAdmin.js');
const tokenChecker = require('./tokenChecker.js');

const admins = require('./admins.js');
const users = require('./users.js');
const dangers = require('./dangers.js');


/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/', express.static('static'));



app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})



/**
 * Authentication routing and middleware
 */
app.use('/api/v1/authentications', authentication);
app.use('/api/v1/authenticationsAdmin', authenticationAdmin);


/**
 * Resource routing
 */
app.use('/api/v1/admins', admins);
app.use('/api/v1/users', users);
app.use('/api/v1/dangers', dangers);



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;
