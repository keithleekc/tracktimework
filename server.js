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
app.post('/', async function(req, res) {
    // Try-Catch for any errors
    try {
        // Get content from page
        const { staffname, timerdate, clickedProjectButton, clickedActivityButton, formattedStartTime, formattedendtime, timerDisplay } = req.body;

        // Reload page if empty title or content
        if (!staffname) {
            console.log("Unable to create new entry, no name was entered.");
            res.render('/');
        } else {
            // Create post and store in database
            const timetracked = await prisma.post.create({
                data: { staffname, timerdate, clickedProjectButton, clickedActivityButton, formattedStartTime, formattedendtime, timerDisplay },
            });

            // Redirect back to the homepage
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        res.render('/');
    }
});

