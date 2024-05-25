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

// GET PAGES
// root page
app.get('/', function(req, res) {
   res.render('index');
});

// PopUp page
app.get('/popup', function(req, res) {
    res.render('popup');
});

// Projects page
app.get('/projects', async function(req, res) {
        // Try-Catch for any errors
        try {
            // Get all project details
            const projectdetails = await prisma.Projectdb.findMany({
                    orderBy: [
                      {
                        id: 'desc'
                      }
                    ]
            });
    
            // Render the project page with all project
            res.render('projects', { projectdetails: projectdetails });
          } catch (error) {
            res.render('projects');
            console.log(error);
          } 
   
});

// Activities page
app.get('/activities', async function(req, res) {
    // Try-Catch for any errors
    try {
        // Get all activities details
        const activitydetails = await prisma.activitydb.findMany({
                orderBy: [
                  {
                    id: 'desc'
                  }
                ]
        });

        // Render the activity page with all project
        res.render('activities', { activitydetails: activitydetails });
      } catch (error) {
        res.render('activity');
        console.log(error);
      }
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
app.listen(5000);



// ROUTE HANDLERS
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



// PROJECT LIST ROUTING
// Create a new project in Projectdb
app.post('/create-project', async function(req, res) {
    // Try-Catch for any errors
    try {
        // Get the project name from the submitted form
        const { ProjectName } = req.body;

        // Create the project and store it in the database
        const newProject = await prisma.Projectdb.create({
            data: { ProjectName },
        });

        // Redirect to the projects page after creating the project
        res.redirect('/projects');
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).send("Internal server error.");
    }
});

// Delete a project by id
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await prisma.Projectdb.delete({
            where: { id: parseInt(id) },
        });
      
        // Redirect back to the projectpage
        res.redirect('/projects');
    } catch (error) {
        console.log(error);
        res.redirect('/projects');
    }
  });


// Add a route to fetch project names
app.get('/project-names', async function(req, res) {
    try {
        const projectDetails = await prisma.Projectdb.findMany();
        const projectNames = projectDetails.map(project => project.ProjectName);
        res.json({ projectNames: projectNames });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
});



// ACTIVITIES LIST ROUTING
// Create a new activity in Projectdb
app.post('/create-activity', async function(req, res) {
    // Try-Catch for any errors
    try {
        // Get the activity name from the submitted form
        const { ActivityName } = req.body;

        // Create the activity and store it in the database
        const newActivity = await prisma.activitydb.create({
            data: { ActivityName },
        });

        // Redirect to the projects page after creating the project
        res.redirect('/activities');
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).send("Internal server error.");
    }
});

// Delete a activity by id
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await prisma.activitydb.delete({
            where: { id: parseInt(id) },
        });
      
        // Redirect back to the projectpage
        res.redirect('/activities');
    } catch (error) {
        console.log(error);
        res.redirect('/activities');
    }
  });


// Add a route to fetch activity names
app.get('/activity-names', async function(req, res) {
    try {
        const activitydetails = await prisma.activitydb.findMany();
        const ActivityNames = activitydetails.map(activity => activity.ActivityName);
        res.json({ ActivityNames: ActivityNames });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
});