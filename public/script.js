
// JS Codes for Main page timer

//Global Variables
let timerInterval;
let timerseconds = 0;
let timerminutes = 0;
let timerhours=0;
let startTime;
let formattedStartTime;
let formattedendtime;
let timerDisplay;
let timerValues;

// Function to get current time
function updateTime() {

const workhrs = parseInt(document.getElementById('inputhrs').value) || 0; // Get hours input value, default to 0 if not provided
const workmins = parseInt(document.getElementById('inputmins').value) || 0; // Get hours input value, default to 0 if not provided

// Check if either hours or minutes is less than 1
if (workhrs < 1 && workmins < 1) {
return; // Exit the function early
}

const now = new Date();
let hours = now.getHours();
const minutes = String(now.getMinutes()).padStart(2, '0');
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'
const hoursStr = hours.toString().padStart(2);
const timeString = `${hoursStr}:${minutes} ${ampm}`;
document.getElementById('starttime').textContent = timeString;
return timeString;
}


//Update Expected End Time
function addTime() {
const workhrs = parseInt(document.getElementById('inputhrs').value) || 0; // Get hours input value, default to 0 if not provided
const workmins = parseInt(document.getElementById('inputmins').value) || 0; // Get hours input value, default to 0 if not provided

expectedEndTime = new Date(startTime);
expectedEndTime.setHours(expectedEndTime.getHours() + workhrs);
expectedEndTime.setMinutes(expectedEndTime.getMinutes() + workmins);

// Display the result
    // Define options for 12-hour format with AM/PM
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    var formattedTime = expectedEndTime.toLocaleTimeString('en-US', options);
    document.getElementById('endtime').textContent = formattedTime;
}


//Function to update timer display
function updateTimer() {
    timerseconds++;

 if (timerseconds === 60) {
     timerseconds = 0;
     timerminutes++;
 }
 if (timerminutes === 60) {
     timerminutes = 0;
     timerhours++;
 }

 const timerDisplay = document.getElementById('duration');
 if (timerDisplay) {
    timerDisplay.textContent = timerhours.toString().padStart(2, '0') + 'hr ' + timerminutes.toString().padStart(2, '0') + 'min ' + timerseconds.toString().padStart(2, '0') + 's';
} else {
    console.error('Timer display element not found.');
}
    // Check if the time is up
    checkTimeUp();

 // Return values as an object
 return {
    hours: timerhours,
    minutes: timerminutes,
    seconds: timerseconds
 };
}


function startTimer() {

const workhrs = parseInt(document.getElementById('inputhrs').value) || 0; // Get hours input value, default to 0 if not provided
const workmins = parseInt(document.getElementById('inputmins').value) || 0; // Get hours input value, default to 0 if not provided

// Check if either hours or minutes is less than 1
if (workhrs < 1 && workmins < 1) {
alert("Please input a valid duration of at least 1 hour or 1 minute.");
return; // Exit the function early
}

// Reset timer values
timerseconds = 0;
timerminutes = 0;
timerhours = 0;

// Clear any existing interval to prevent multiple timers running simultaneously
if (timerInterval) {
 clearInterval(timerInterval);
 timerInterval = null;
  }

  // Store the start time
startTime = new Date();

const startTimeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
};

formattedStartTime = startTime.toLocaleTimeString('en-US', startTimeOptions);
document.getElementById('starttime').textContent = formattedStartTime;

timerdate = startTime.toISOString();

// // Extract the day, month, and year components and store the date
// const day = startTime.getDate();
// const month = startTime.getMonth() + 1; // Month is zero-based, so add 1
// const year = startTime.getFullYear();

// // Combine the components to create the calendar date string
// timerdate = day + '-' + month + '-' + year;

// Call addTime to set expected end time
addTime();

 // Check if the time is up
checkTimeUp();

 // Update the timer every second
 timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
     // Capture the actual end time
    const actualendtime = new Date();
    const endtimeoptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true

    };
    const formattedendtime = actualendtime.toLocaleTimeString('en-US', endtimeoptions);
    document.getElementById('endtime').textContent = formattedendtime;

    return formattedendtime;       
    }

// Function to check if the time is up
function checkTimeUp() {
const currentTime = new Date();
if (currentTime > expectedEndTime) {
    stopTimer();
    openPopup("/popup", "Time's Up!", 400, 300);
    alert("Time's up! If you need more time, pls press the start button to track the activity again.");
    endbutton();
    
}
}
  
// Function to handle the start button click    
function startbutton() {
updateTime();
startTimer();
}

// Function to send the data to the server
function sendDataToServer() {
    
    console.log(timerhours);
    console.log(timerminutes);
    console.log(timerseconds);
    console.log(timerDisplay);
    console.log(timerdate);
    console.log(formattedStartTime);
    console.log(formattedendtime);
    console.log(staffname);
    console.log(clickedActivityButton);
    console.log(clickedProjectButton);
    
    // Send a POST request to the server with the data
    fetch('/post-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
            }),
    });
}

// Function to handle the end button click and alert the user
function endbutton() {
    formattedendtime = stopTimer();
    timerDisplay = document.getElementById('duration').textContent;

    const startTimeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const formattedStartTime = startTime.toLocaleTimeString('en-US', startTimeOptions);

    alert("\nDate of Time Tracked: " + timerdate + "\n\nTime Tracked: " + timerDisplay + "\nStart Time: " + formattedStartTime + "\nEnd Time: " + formattedendtime + "\nOfficer Name: " + staffname + "\nProject: " + clickedProjectButton + "\nActivity: " + clickedActivityButton);

    // Send the data to the server
    sendDataToServer();
}


// Function to get user's name
var staffname = getname();

window.onload = function() {
    document.getElementById('welcomeusername').textContent = "Welcome " + staffname + "!";
    document.getElementById('errormsg').textContent = "";  // Clear the error message
}

function getname() {
    var staffname = null;
    while (staffname === null || staffname.trim() === "") {
        staffname = prompt("Good Day! \nMay I have your Name pls?");
        if (staffname === null) {
            // Handle if user cancels the prompt
            document.getElementById('errormsg').textContent = "ERROR: No name entered!";
            break; // Exit the loop if the prompt is canceled
        } else if (staffname.trim() === "") {
            // Display error message if the entered name is empty
            document.getElementById('errormsg').textContent = "ERROR: No name entered!";
        } else {
            // Clear error message if username is provided
            document.getElementById('errormsg').textContent = "";
        }
    }
       return staffname;
}

// Creating Project buttons
// Sample array of button labels
const PbuttonLabels = ["Project X", "Project NDI", "Project CAM", "Project Z"];

// Variable to store the clicked button's label
let clickedProjectButton = null;

// Function to create buttons from the array
function createPButtons() {
    const PbuttonContainer = document.getElementById('Pbutton-container');

    // Clear existing buttons
    PbuttonContainer.innerHTML = '';

    // Create buttons from the array
    PbuttonLabels.forEach(label => {
        const projectbutton = document.createElement('button');
        projectbutton.textContent = label;
        projectbutton.classList.add('projectbutton'); // Add CSS class for styling
        projectbutton.addEventListener('click', () => {
               // Remove the "clicked" class from all buttons
               document.querySelectorAll('.projectbutton').forEach(button => {
                button.classList.remove('clicked');
                });
                // Store the clicked button's label
                clickedProjectButton = label;
                // Apply the "clicked" style to the clicked button
                projectbutton.classList.add('clicked');
                });
                PbuttonContainer.appendChild(projectbutton);
    });
}

// Call the function to create buttons initially
createPButtons();



// Creating Activity buttons
// Sample array of button labels
const buttonLabels = ["Planning", "Development", "Engagement", "Enhancement", "Service Journey", "UAT"];

// Variable to store the clicked button's label
let clickedActivityButton = null;

// Function to create buttons from the array
function createButtons() {
    const buttonContainer = document.getElementById('button-container');

    // Clear existing buttons
    buttonContainer.innerHTML = '';

    // Create buttons from the array
    buttonLabels.forEach(label => {
        const activitybutton = document.createElement('button');
        activitybutton.textContent = label;
        activitybutton.classList.add('activitybutton'); // Add CSS class for styling
        activitybutton.addEventListener('click', () => {
            // Remove the "clicked" class from all buttons
               document.querySelectorAll('.activitybutton').forEach(button => {
                button.classList.remove('clicked');
                });
                // Store the clicked button's label
                clickedActivityButton = label;
                // Apply the "clicked" style to the clicked button
                activitybutton.classList.add('clicked');
                                   
        });
        buttonContainer.appendChild(activitybutton);
    });
}
// Call the function to create buttons initially
createButtons();



// Function to open a pop-up window
function openPopup(url, title, width, height) {
// Calculate the position of the window to center it on the screen
const left = (window.innerWidth - width) / 2;
const top = (window.innerHeight - height) / 2;
// Define window features
const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
// Open the pop-up window
const popupWindow = window.open(url, title, features);
// Focus on the pop-up window
popupWindow.focus();

// Automatically close the popup after 3 seconds
setTimeout(() => {
popupWindow.close();
}, 3000);
}