//Boilerplate codes for backend

// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()
var path = require('path')

// Setting where the location of your EJS files are
app.set('views', '.')

// Needed for EJS
app.set('view engine', 'ejs');

// Set the directory for views
app.set('views', path.join(__dirname, 'views'));

// Needed for public directory
app.use(express.static(__dirname + '/public'));

// Needed for parsing form data
app.use(express.json());      
app.use(express.urlencoded({extended: true}));

// Needed for Prisma to connect to database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

// root page
app.get('/', function(req, res) {
   res.render('index');
});

// About page
app.get('/popup', function(req, res) {
    res.render('popup');
});

// Tells the app which port to run on
app.listen(8080);

// Define the route handler for POST requests
app.post('/post-data', async function(req, res) {
    // Try-Catch for any errors
    try {
                // Get content from page
                const { staffname, timerdate, clickedProjectButton, clickedActivityButton, formattedStartTime, formattedendtime, timerDisplay, timerhours, timerminutes, timerseconds } = req.body;

                // Reload page if empty title or content
                if (!staffname || !timerdate || !clickedProjectButton || !clickedActivityButton || !formattedStartTime || !formattedendtime || !timerDisplay || !timerhours || !timerminutes || !timerseconds) {
                    console.log("Unable to create new entry, some fields are missing.");
                    return res.status(400).send("All fields are required.");
                }
        
                // Create post and store in database
                const timetracked = await prisma.post.create({
                    data: { 
                        staffname, 
                        timerdate, 
                        clickedProjectButton, 
                        clickedActivityButton, 
                        formattedStartTime, 
                        formattedendtime, 
                        timerDisplay,
                        timerhours,
                        timerminutes,
                        timerseconds,
                    },
                });
                
                console.log(timetracked);

                // Redirect to a different page or send a confirmation message
                res.status(200).send("Data saved successfully!");
            } catch (error) {
                console.log(error);
                res.status(500).send("Internal server error.");
            }
        });

