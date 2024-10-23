// set global variables
let scoreA = 0;
let scoreB = 0;
const teamA_serve = 1;
const teamB_serve = 2;
let servingTeam = 0;
let teamAName = "Team 1";
let teamBName = "Team 2";
//let servingTeam = null; /* 'A';   null for now and assumes we don't know who is serving */
let strScoreType = document.getElementById('scoringType').value;


function updateTeamNames() {
   //document.querySelector('input[name="team1"]').innerHTML    = teamAName;
   document.getElementsByName('team1')[0].innerHTML = teamAName;
   document.getElementsByName('team2')[0].innerHTML = teamBName;
}
// set the default team names using the global variables
updateTeamNames();


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
       } else if (team === 'B') {
           scoreB++;
           scoreBElement.innerText = scoreB;
       }
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
}


function switchDivs() {
   let container = document.getElementsByClassName('container')[0];
   container.appendChild(container.children[0]);
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
}

