//get all needed dom elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

//track attendance
let count = 0;
const maxCount = 50;

//handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

    //get form values
    const name = nameInput.value;
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text;

    console.log(name, teamName);

    //increment count
    count++;
    console.log("Total check-ins: " + count);


    //update progress bar
    const percentage = Math.round((count / maxCount) * 100) + "%";
    console.log(`Progress: ${percentage}`);

    //update team counter
    const teamCounter = document.getElementById(team + "Count");
    //console.log(teamCounter);
    teamCounter.textContent = parseInt(teamCounter.textContent) + 1;
    //const current = parseInt(teamCounter.textContent);
    //console.log("Previous team count: " + current);
    //const newTotal = current + 1;
    //console.log("New team count: " + newTotal);

    //show welcome message
    const message = `🎉 Welcome, ${name} from ${teamName}!`;
    console.log(message);

    form.reset();

});