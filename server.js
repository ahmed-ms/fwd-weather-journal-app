// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cros = require('cors');
const { response } = require('express');
app.use(cros());
// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8080;

const listening = prot => console.log(`Server listening : ${port}`);
// Post route callback , add data to project endpoint
const addDataToProjec = (req, res) => {
    console.log('Post Data recived');
    console.log(req.body);
    projectData['weather'] = req.body;
    res.send(projectData['weather']);
}
// Post route 
app.post('/postData', addDataToProjec);
// Get route , return endpoint data
app.get('/getMostEntry', (req, res) => res.send(projectData['weather']));


// Strat server
const server = app.listen(port, listening);