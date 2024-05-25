//Boilerplate codes for backend

// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()
var path = require('path')

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
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// root page
app.get('/', function(req, res) {
   res.render('index');
});

// PopUp page
app.get('/popup', function(req, res) {
    res.render('popup');
});
// Project Tracked Time History Page
app.get('/history', async function(req, res) {
    // Try-Catch for any errors
    try {
        // Get all unique project names from the clickedProjectButton column
        const projects = await prisma.post.findMany({
            distinct: ['clickedProjectButton'],
            select: {
                clickedProjectButton: true,
            },
        });

        // Get all project tracked history
        const projhistory = await prisma.post.findMany({
            orderBy: [
              {
                id: 'asc'
              }
            ]
        });

        // Render the history page with all the tracked time and project names
        res.render('history', { projects: projects, projhistory: projhistory });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    } 
});




// Tells the app which port to run on
app.listen(8000);

// Define the route handler for POST requests
app.post('/post-data', async function(req, res) {
    // Try-Catch for any errors
    try {
                // Get content from page
                const { staffname, timerdate, clickedProjectButton, clickedActivityButton, formattedStartTime, formattedendtime, timerDisplay,timerhoursint,timerminutesint } = req.body;

                // Reload page if empty title or content
                if (!staffname || !timerdate || !clickedProjectButton || !clickedActivityButton || !formattedStartTime || !formattedendtime || !timerDisplay) {
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
                        timerhoursint,
                        timerminutesint,
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


// Add a route to fetch project data
app.get('/project-data/:projectId', async function(req, res) {
    try {
        const projectId = req.params.projectId;

        let projectData;
        if (projectId === '') {
            // If projectId is empty, fetch all project data
            projectData = await prisma.post.findMany({
                orderBy: [
                    {
                        id: 'asc'
                    }
                ]
            });
        } else {
              // Otherwise, fetch data for the selected project
              projectData = await prisma.post.findMany({
                where: {
                    clickedProjectButton: projectId
                },
                orderBy: [
                    {
                        id: 'asc'
                    }
                ]
            });
        }

        // Send the project data as JSON response
        res.json(projectData);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
});