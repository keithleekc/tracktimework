
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
let timerhoursint;
let timerminutesint;

// Function to get current time and display as current start time
function updateTime() {

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


//Update Expected End Time adds User input expected working time to starttime and display in End Time field
function addTime() {
const workhrs = parseInt(document.getElementById('inputhrs').value) || 0; // Get hours input value, default to 0 if not provided
const workmins = parseInt(document.getElementById('inputmins').value) || 0; // Get hours input value, default to 0 if not provided

// Check if either hours or minutes is less than 1
if (workhrs < 1 && workmins < 1) {
    return; // Exit the function early
    }

expectedEndTime = new Date(startTime);
expectedEndTime.setHours(expectedEndTime.getHours() + workhrs);
expectedEndTime.setMinutes(expectedEndTime.getMinutes() + workmins);

// Display the result in End Time Field
    // Define options for 12-hour format with AM/PM
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    var formattedTime = expectedEndTime.toLocaleTimeString('en-US', options);
    document.getElementById('endtime').textContent = formattedTime;
}

//Function to update timer display that ticks in seconds and function based on the difference of current time and start time
function updateTimer() {
    // Get the current time
    const currentTime = new Date();
    
    // Calculate the difference in milliseconds between the current time and the start time
    const timeDifference = currentTime.getTime() - startTime.getTime();

    // Convert the time difference to hours, minutes, and seconds
    const timerhours = Math.floor(timeDifference / (1000 * 60 * 60));
    const timerminutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const timerseconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
       
  
    const timerDisplay = document.getElementById('duration');
    if (timerDisplay) {
    timerDisplay.textContent = timerhours.toString().padStart(2, '0') + 'hr ' + timerminutes.toString().padStart(2, '0') + 'min ' + timerseconds.toString().padStart(2, '0') + 's';
    
    //Store timer hours and minutes as interger in variable before they are stored in db later
    timerhoursint=parseInt(timerhours);
    timerminutesint=parseInt(timerminutes);

} else {
    console.error('Timer display element not found.');
}
    checkTimeUp();

 // Return values as an object
 return timerhours;
}

// Sets the functions on what to do when timer starts.
// Validate user expected time, Reset Timer, Clear timerInterval, Store actual start time and date, add expected end time based on actual start time, stops the function when expected time is up.
function startTimer() {

const workhrs = parseInt(document.getElementById('inputhrs').value) || 0; // Get hours input value, default to 0 if not provided
const workmins = parseInt(document.getElementById('inputmins').value) || 0; // Get hours input value, default to 0 if not provided

// Validate the input
if (workhrs > 24 || (workhrs === 24 && workmins > 0) || workmins > 59) {
    alert("Please input a valid duration of the most 23 hours and 59 minutes.");
    // Clear the input fields or reset them to the maximum values
    workhrsInput.value = 23;
    workminsInput.value = 59;
} else if (workhrs < 1 && workmins < 1) {
    alert("Please input a valid duration of at least 1 hour or 1 minute.");
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

//Store date of timer started
timerdate = startTime.toISOString();

// Call addTime to set expected end time
addTime();

 // Check if the time is up
checkTimeUp();

 // Update the timer every second
 timerInterval = setInterval(updateTimer, 1000);
}



// Sets the function on what to do when timer stops
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
    //openPopup("/popup", "Time's Up!", 400, 300);
    //alert("Time's up! If you need more time, pls press the start button to track the activity again.");
    endbutton();
    }
}
  
// Function to handle the start button click    
function startbutton() {
updateTime();
startTimer();
}

// Function to send the data of time tracked in the session to the server
function sendDataToServer() {
    
    console.log(timerhoursint);
    console.log(timerminutesint);
    //console.log(timerseconds);
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
            timerhoursint,
            timerminutesint,
            }),
    });
}

// Function to handle the end button click and alert the user
// When end button function is triggered, Get end time, timer duration, start time; alert user time tracked and store to server db
function endbutton() {
    formattedendtime = stopTimer();
    timerDisplay = document.getElementById('duration').textContent;

    const startTimeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const formattedStartTime = startTime.toLocaleTimeString('en-US', startTimeOptions);

    alert("Time Tracked: " + timerDisplay + "\nStart Time: " + formattedStartTime + "\nEnd Time: " + formattedendtime + "\nOfficer Name: " + staffname + "\nProject: " + clickedProjectButton + "\nActivity: " + clickedActivityButton + "\n\nPls press the START button if you want to continue to track the activity. However, timer will reset."+"\n\nSystem Date: " + timerdate);

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
        staffname = prompt("Good Day! \nMay I have your name please?");
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

    // Function to fetch project names from the server
    async function fetchProjectNames() {
        try {
            const response = await fetch('/project-names'); // Fetch project names from server endpoint
            const data = await response.json();
            return data.projectNames;
        } catch (error) {
            console.error(error);
            return [];
        }
    }


// Variable to store the clicked Project button's label
let clickedProjectButton = null;

// Function to create project buttons
async function createPButtons() {
    const PbuttonContainer = document.getElementById('Pbutton-container');

    // Clear existing buttons
    PbuttonContainer.innerHTML = '';

    // Fetch project names from the server
    const projectNames = await fetchProjectNames();
    
    // Create buttons from the Projectdb
    projectNames.forEach(projectName => {
        const projectbutton = document.createElement('button');
        projectbutton.textContent = projectName;
        projectbutton.classList.add('projectbutton'); // Add CSS class for styling
        projectbutton.addEventListener('click', () => {
               // Remove the "clicked" class from all buttons
               document.querySelectorAll('.projectbutton').forEach(button => {
                button.classList.remove('clicked');
                });
                // Store the clicked button's label
                clickedProjectButton = projectName;
                // Apply the "clicked" style to the clicked button
                projectbutton.classList.add('clicked');
                });
                PbuttonContainer.appendChild(projectbutton);
    });
}

// Call the function to create buttons initially
createPButtons();



// Creating Activity buttons

  // Function to fetch activity names from the server
  async function fetchActivityNames() {
    try {
        const response = await fetch('/activity-names'); // Fetch activity names from server endpoint
        const data = await response.json();
        return data.ActivityNames;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Variable to store the clicked Activity button's label
let clickedActivityButton = null;

// Function to create buttons from the array
async function createButtons() {
    const buttonContainer = document.getElementById('button-container');

    // Clear existing buttons
    buttonContainer.innerHTML = '';

// Fetch activity names from the server
const ActivityNames = await fetchActivityNames();

    // Create buttons from the array
    ActivityNames.forEach(activityName => {
        const activitybutton = document.createElement('button');
        activitybutton.textContent = activityName;
        activitybutton.classList.add('activitybutton'); // Add CSS class for styling
        activitybutton.addEventListener('click', () => {
            // Remove the "clicked" class from all buttons
               document.querySelectorAll('.activitybutton').forEach(button => {
                button.classList.remove('clicked');
                });
                // Store the clicked button's label
                clickedActivityButton = activityName;
                // Apply the "clicked" style to the clicked button
                activitybutton.classList.add('clicked');
                                   
        });
        buttonContainer.appendChild(activitybutton);
    });
}
// Call the function to create buttons initially
createButtons();



// Function to open a pop-up window - Not in Use Now
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

