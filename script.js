//testing commit without pull
// set global variables
let scoreA = 0;
let scoreB = 0;
const teamA_serve = 1;
const teamB_serve = 2;
let servingTeam = 0;
let teamAName = "";
let teamBName = "";
//let servingTeam = null; /* 'A';   null for now and assumes we don't know who is serving */
let strScoreType = document.getElementById('scoringType').value;
let isSwitched = false; // used to track if the teams have been switched


function updateTeamNames() {
    document.getElementsByName('team1')[0].innerHTML = teamAName || "Team A";
    document.getElementsByName('team2')[0].innerHTML = teamBName || "Team B";
    document.getElementById('team1').value = teamAName;
    document.getElementById('team2').value = teamBName;

}
// set the default team names using the global variables
updateTeamNames();

function updateTeamAName() {
    const input = document.getElementById('team1');
    if (input.value.trim() === "") {
        teamAName = "";
    } else {
        teamAName = input.value;
    }
    updateTeamNames();
    saveState();
}

function updateTeamBName() {
    const input = document.getElementById('team2');
    if (input.value.trim() === "") {
        teamBName = "";
    } else {
        teamBName = input.value;
    }
    updateTeamNames();
    saveState();
}


function setScoring() {
   //selectElement = document.querySelector('#scoringType');
   //scoringType = selectElement.value;
   //document.querySelector('.output').textContent = scoringType;
}


function increaseScore(team) {
   selectElement = document.querySelector('#scoringType');
   scoringType = selectElement.value;


   const scoreAElement = document.querySelector('#scoreA span');
   const scoreBElement = document.querySelector('#scoreB span');


   //add functionality for sideout and rally scoring
   if (scoringType === 'sideout') {
       /* sideout scoring */
       if (team === 'A') {
           if (servingTeam == teamA_serve) {
               scoreA++;
               scoreAElement.innerText = scoreA;
           } else {
               servingTeam = teamA_serve;
           }
       } else if (team === 'B') {
           if (servingTeam == teamB_serve) {
               scoreB++;
               scoreBElement.innerText = scoreB;
           } else {
               servingTeam = teamB_serve;
           }
       }
      
   } else if (scoringType === 'rally') {
       /* rally scoring */
       if (team === 'A') {
           scoreA++;
           scoreAElement.innerText = scoreA;
           servingTeam = teamA_serve;
        } else if (team === 'B') {
           scoreB++;
           scoreBElement.innerText = scoreB;
           servingTeam = teamB_serve;
        }
   }

   // Set focus to the correct button to trigger :focus underline
   if (team === 'A') {
       document.getElementById('scoreA').focus();
   } else if (team === 'B') {
       document.getElementById('scoreB').focus();
   }
  
   //if (team === 'A') {
   //    scoreA++;
   //    scoreAElement.innerText = scoreA;
       //scoreAElement.style.border = '5px solid black';
       //scoreBElement.style.border = 'none';
   //    servingTeam = 'A'; /* used for sideout */
   //} else if (team === 'B') {
   //    scoreB++;
   //    scoreBElement.innerText = scoreB;
       //scoreBElement.style.border = '5px solid black';
       //scoreAElement.style.border = 'none';
   //    servingTeam = 'B'; /* used for sideout */
   //}
   //console.log(servingTeam);
   
    saveState();
}


function toggleMenu() {
   const menuOverlay = document.getElementById('menuOverlay');
   const scoreButtons = document.querySelectorAll('.score-button');
   if (menuOverlay.style.display === 'flex') {
       menuOverlay.style.display = 'none';
       scoreButtons.forEach(button => button.disabled = false);
   } else {
       menuOverlay.style.display = 'flex';
       scoreButtons.forEach(button => button.disabled = true);
       document.getElementById('adjustScoreA').innerText = scoreA;
       document.getElementById('adjustScoreB').innerText = scoreB;
   }
   // this section is needed to make the underline appear after the menu loses focus
   //console.log("servingTeam is " + servingTeam);
   if (servingTeam == teamA_serve) {
       document.getElementById("scoreA").focus();
       //console.log("should be A - " + servingTeam);
   } else if (servingTeam == teamB_serve) {
       document.getElementById("scoreB").focus();
       //console.log("should be B - " + servingTeam);
   }
}


function resetScores() {
   scoreA = 0;
   scoreB = 0;
   document.querySelector('#scoreA span').innerText = scoreA;
   document.querySelector('#scoreB span').innerText = scoreB;
   document.getElementById('adjustScoreA').innerText = scoreA;
   document.getElementById('adjustScoreB').innerText = scoreB;
   servingTeam = null;
   saveState();
}


function adjustScore(team, amount) {
   if (team === 'A') {
       scoreA = Math.max(0, scoreA + amount);
       document.querySelector('#scoreA span').innerText = scoreA;
       document.getElementById('adjustScoreA').innerText = scoreA;
   }
   if (team === 'B') {
       scoreB = Math.max(0, scoreB + amount);
       document.querySelector('#scoreB span').innerText = scoreB;
       document.getElementById('adjustScoreB').innerText = scoreB;
   }
   saveState();
}


function switchDivs() {
   let container = document.getElementsByClassName('container')[0];
   container.appendChild(container.children[0]);
   isSwitched = !isSwitched;
   saveState();
   //console.log('switchted!');
  
   // this section is needed to make the underline appear on the right button after the switch
   //console.log("servingTeam is " + servingTeam);
   if (servingTeam == teamA_serve) {
       document.getElementById("scoreA").focus();
       //console.log("should be A - " + servingTeam);
   } else if (servingTeam == teamB_serve) {
       document.getElementById("scoreB").focus();
       //console.log("should be B - " + servingTeam);
   }
   saveState();
}

// Allow closing menu by clicking outside the menu content
document.getElementById('menuOverlay').addEventListener('click', function(event) {
    if (event.target === this) {
        toggleMenu();
    }
});


// Load saved state from localStorage
function saveState() {
    localStorage.setItem('vbscore_state', JSON.stringify({
        scoreA,
        scoreB,
        teamAName,
        teamBName,
        servingTeam,
        scoringType: document.getElementById('scoringType').value,
        isSwitched
    }));
}

document.getElementById('scoringType').addEventListener('change', saveState);

function loadState() {
    const state = JSON.parse(localStorage.getItem('vbscore_state'));
    if (state) {
        scoreA = state.scoreA || 0;
        scoreB = state.scoreB || 0;
        teamAName = state.teamAName || "";
        teamBName = state.teamBName || "";
        servingTeam = state.servingTeam || 0;
        document.getElementById('scoringType').value = state.scoringType || 'sideout';
        isSwitched = state.isSwitched || false;
    }
}

loadState();
updateTeamNames();
document.querySelector('#scoreA span').innerText = scoreA;
document.querySelector('#scoreB span').innerText = scoreB;
document.getElementById('adjustScoreA').innerText = scoreA;
document.getElementById('adjustScoreB').innerText = scoreB;

// Restore underline to the last serving team after loading state
if (servingTeam == teamA_serve) {
    document.getElementById("scoreA").focus();
} else if (servingTeam == teamB_serve) {
    document.getElementById("scoreB").focus();
}

if (isSwitched == true) {
    switchDivs();
    isSwitched = true;
    saveState();
}
