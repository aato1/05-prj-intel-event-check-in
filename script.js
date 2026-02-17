//get all needed dom elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const attendeeCount = document.getElementById("attendeeCount");
const greeting = document.getElementById("greeting");
const celebrationMessage = document.getElementById("celebrationMessage");
const progressBar = document.getElementById("progressBar");

const teamCounters = document.querySelectorAll(".team-count");
const teamLists = {
    water: document.getElementById("waterList"),
    zero: document.getElementById("zeroList"),
    power: document.getElementById("powerList")
};

//let savedAttendance = localStorage.getItem("attendeeCount") || "";


//track attendance
let count = 0;
const maxCount = 5;

const teamStorageKeys = {
    water: "waterNames",
    zero: "zeroNames",
    power: "powerNames"
};

function getTeamNames(teamKey) {
    const savedNames = localStorage.getItem(teamStorageKeys[teamKey]);
    if (!savedNames) {
        return [];
    }

    try {
        const parsedNames = JSON.parse(savedNames);
        if (Array.isArray(parsedNames)) {
            return parsedNames;
        }
        return [];
    } catch (error) {
        return [];
    }
}

function saveTeamNames(teamKey, names) {
    localStorage.setItem(teamStorageKeys[teamKey], JSON.stringify(names));
}

function renderTeamList(teamKey, names) {
    const listElement = teamLists[teamKey];
    listElement.innerHTML = "";

    for (const attendeeName of names) {
        const listItem = document.createElement("li");
        listItem.textContent = attendeeName;
        listElement.appendChild(listItem);
    }
}

function updateCelebrationMessage() {
    if (count !== maxCount) {
        celebrationMessage.style.display = "none";
        celebrationMessage.classList.remove("celebration-message");
        celebrationMessage.textContent = "";
        return;
    }

    const teamNameMap = {
        waterCount: "Team Water Wise",
        zeroCount: "Team Net Zero",
        powerCount: "Team Renewables"
    };

    let highestCount = -1;
    let winners = [];

    for (const teamCount of teamCounters) {
        const currentCount = parseInt(teamCount.textContent, 10) || 0;
        if (currentCount > highestCount) {
            highestCount = currentCount;
            winners = [teamCount.id];
        } else if (currentCount === highestCount) {
            winners.push(teamCount.id);
        }
    }

    const winnerNames = [];
    for (const winnerId of winners) {
        winnerNames.push(teamNameMap[winnerId]);
    }

    let winnerText = "";
    if (winnerNames.length === 1) {
        winnerText = winnerNames[0];
    } else if (winnerNames.length === 2) {
        winnerText = `${winnerNames[0]} and ${winnerNames[1]}`;
    } else {
        winnerText = `${winnerNames[0]}, ${winnerNames[1]}, and ${winnerNames[2]}`;
    }

    if (winnerNames.length === 1) {
        celebrationMessage.textContent = `🏆 Congrats! ${winnerText} wins the challenge!`;
    } else {
        celebrationMessage.textContent = `🏆 Congrats! ${winnerText} tied for first!`;
    }

    celebrationMessage.style.display = "block";
    celebrationMessage.classList.add("celebration-message");
}


if (localStorage.getItem("savedTotalAttendance")) {
    //attendeeCount.textContent = savedAttendance;

    // const teamCounter = document.getElementById(team + "Count");
    // teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

    // for (const team of teamCounters) {
    //     localStorage.setItem(team.id, team.textContent);
    // }

    count = parseInt(localStorage.getItem("savedTotalAttendance"), 10) || 0;
    const percentage = Math.round((count / maxCount) * 100) + "%";

    attendeeCount.innerText = count;
    progressBar.style.width = percentage;

    for (const team of teamCounters) {
        const savedTeamCount = parseInt(localStorage.getItem(team.id), 10) || 0;
        team.textContent = savedTeamCount;
    }

    renderTeamList("water", getTeamNames("water"));
    renderTeamList("zero", getTeamNames("zero"));
    renderTeamList("power", getTeamNames("power"));
    updateCelebrationMessage();
} else {
    //initialize local storage values if not already set
    localStorage.setItem("savedTotalAttendance", count);
    for (const team of teamCounters) {
        localStorage.setItem(team.id, team.textContent);
    }

    saveTeamNames("water", []);
    saveTeamNames("zero", []);
    saveTeamNames("power", []);
    updateCelebrationMessage();
}



//handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

    //get form values
    const name = nameInput.value.trim();
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text;

    console.log(name, teamName);

    //increment count
    count++;
    //console.log("Total check-ins: " + count);
    attendeeCount.innerText = count;


    //update progress bar
    const percentage = Math.round((count / maxCount) * 100) + "%";
    //console.log(`Progress: ${percentage}`);
    progressBar.style.width = percentage;


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
    //console.log(message);

    greeting.textContent = message;
    greeting.style.display = "block";
    greeting.classList.add("success-message");
    updateCelebrationMessage();


    //save to local storage
    localStorage.setItem("savedTotalAttendance", count);
    
    for (const team of teamCounters) {
        localStorage.setItem(team.id, team.textContent);
    }

    const currentTeamNames = getTeamNames(team);
    currentTeamNames.push(name);
    saveTeamNames(team, currentTeamNames);
    renderTeamList(team, currentTeamNames);

    form.reset();

});