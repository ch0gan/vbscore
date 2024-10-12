// test

let scoreA = 0;
let scoreB = 0;
let servingTeam = null; /* 'A';   null for now and assumes we don't know who is serving */
let strScoreType = document.getElementById('scoringType').value;

function setScoring() {
    selectElement = document.querySelector('#scoringType');
    scoringType = selectElement.value;
    document.querySelector('.output').textContent = scoringType;
}

function increaseScore(team) {
    const scoreAElement = document.querySelector('#scoreA span');
    const scoreBElement = document.querySelector('#scoreB span');

    if (strScoreType == 'sideout') {
        /* sideout scoring */

    } else {
        /* rally scoring */

    }

    if (team === 'A') {
        scoreA++;
        scoreAElement.innerText = scoreA;
        scoreAElement.style.border = '5px solid black';
        scoreBElement.style.border = 'none';
        servingTeam = 'A'; /* used for sideout */
    } else if (team === 'B') {
        scoreB++;
        scoreBElement.innerText = scoreB;
        scoreBElement.style.border = '5px solid black';
        scoreAElement.style.border = 'none';
        servingTeam = 'B'; /* used for sideout */
    }
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
}

function resetScores() {
    scoreA = 0;
    scoreB = 0;
    document.querySelector('#scoreA span').innerText = scoreA;
    document.querySelector('#scoreB span').innerText = scoreB;
    document.getElementById('adjustScoreA').innerText = scoreA;
    document.getElementById('adjustScoreB').innerText = scoreB;
}

function adjustScore(team, amount) {
    if (team === 'A') {
        scoreA = Math.max(0, scoreA + amount);
        document.querySelector('#scoreA span').innerText = scoreA;
        document.getElementById('adjustScoreA').innerText = scoreA;
    } else if (team === 'B') {
        scoreB = Math.max(0, scoreB + amount);
        document.querySelector('#scoreB span').innerText = scoreB;
        document.getElementById('adjustScoreB').innerText = scoreB;
    }
}
