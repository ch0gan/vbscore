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
let setNumber = 1;         // which set is being played
let currentMatchId = null; // id of the match in history that sets are being added to


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
    closeCurrentMatch(); // new team name means a new match
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
    closeCurrentMatch(); // new team name means a new match
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
        isSwitched,
        setNumber,
        currentMatchId
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
        setNumber = state.setNumber || 1;
        currentMatchId = state.currentMatchId || null;
    }
}


// ---------- Match history ----------
// History is a list of matches saved in localStorage, newest first:
// { id, date, day, teamA, teamB, sets: [{ a, b }, ...], ended }
// Team A is always the blue team and Team B the red team.
const HISTORY_KEY = 'vbscore_history';

function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function todayKey() {
    return new Date().toDateString();
}

function displayNameA() { return teamAName.trim() || "Team A"; }
function displayNameB() { return teamBName.trim() || "Team B"; }

// Count sets won by each team, e.g. { a: 2, b: 1 }
function setsWon(sets) {
    let a = 0, b = 0;
    sets.forEach(s => { if (s.a > s.b) a++; else if (s.b > s.a) b++; });
    return { a, b };
}

function updateSetLabel() {
    document.getElementById('setLabel').innerText = 'Set ' + setNumber;
}

// Stop adding sets to the current match. Its saved sets stay in history.
function closeCurrentMatch() {
    if (currentMatchId !== null) {
        const history = loadHistory();
        const match = history.find(m => m.id === currentMatchId);
        if (match) {
            match.ended = true;
            saveHistory(history);
        }
    }
    currentMatchId = null;
    setNumber = 1;
    updateSetLabel();
}

// Close the settings menu if it's open (End Set and History can be opened from it)
function closeMenu() {
    if (document.getElementById('menuOverlay').style.display === 'flex') {
        toggleMenu();
    }
}

// Drop-down menu on the "Set 2" button
function toggleSetMenu() {
    const menu = document.getElementById('setMenu');
    const open = menu.style.display !== 'flex';
    menu.style.display = open ? 'flex' : 'none';
    document.getElementById('setMenuBackdrop').style.display = open ? 'block' : 'none';
}

function closeSetMenu() {
    document.getElementById('setMenu').style.display = 'none';
    document.getElementById('setMenuBackdrop').style.display = 'none';
}

// Show the End Set box with the match box score, including this set
function openFinalSet() {
    closeMenu();

    const tied = scoreA === scoreB;
    document.getElementById('finalButtons').style.display = tied ? 'none' : 'flex';
    document.getElementById('finalTiedButtons').style.display = tied ? 'flex' : 'none';

    const grid = document.getElementById('finalGrid');
    const message = document.getElementById('finalMatch');
    grid.innerHTML = '';
    message.innerText = '';

    if (tied) {
        document.getElementById('finalTitle').innerText = "A set can't end tied";
        message.innerText = 'The score is ' + scoreA + '–' + scoreB + '. Adjust the score in the menu, then try again.';
    } else {
        document.getElementById('finalTitle').innerText = 'End set ' + setNumber;
        const match = loadHistory().find(m => m.id === currentMatchId);
        grid.appendChild(buildLineScore({
            teamA: displayNameA(),
            teamB: displayNameB(),
            sets: (match ? match.sets : []).concat([{ a: scoreA, b: scoreB }]),
            ended: false
        }));
    }

    document.getElementById('finalOverlay').style.display = 'flex';
}

function closeFinalSet() {
    document.getElementById('finalOverlay').style.display = 'none';
}

// Save this set to history. endMatch = true closes the match; false starts the next set.
function recordSet(endMatch) {
    const history = loadHistory();
    let match = history.find(m => m.id === currentMatchId);
    if (!match) {
        match = {
            id: Date.now(),
            date: new Date().toISOString(),
            day: todayKey(),
            teamA: displayNameA(),
            teamB: displayNameB(),
            sets: [],
            ended: false
        };
        history.unshift(match);
        currentMatchId = match.id;
    }
    match.sets.push({ a: scoreA, b: scoreB });
    saveHistory(history);

    if (endMatch) {
        closeCurrentMatch();
    } else {
        setNumber++;
        updateSetLabel();
    }
    closeFinalSet();
    resetScores(); // back to 0-0 (also saves state)
}

function openHistory() {
    closeMenu();
    renderHistory();
    document.getElementById('historyPage').style.display = 'flex';
}

function closeHistory() {
    document.getElementById('historyPage').style.display = 'none';
}

function renderHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    const history = loadHistory();

    if (history.length === 0) {
        const p = document.createElement('p');
        p.className = 'history-empty';
        p.innerText = 'No matches yet. When a set ends, tap the Set button and choose End Set to save it here.';
        list.appendChild(p);
        return;
    }

    history.forEach(match => list.appendChild(renderMatch(match)));
}

// One match in the history list: date, Delete button, and its box score
function renderMatch(match) {
    const wrap = document.createElement('div');
    wrap.className = 'match';

    // Date, "in progress" tag, and Delete button
    const info = document.createElement('div');
    info.className = 'match-info';
    const date = document.createElement('span');
    date.innerText = new Date(match.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    if (!match.ended) {
        const live = document.createElement('span');
        live.className = 'match-live';
        live.innerText = '· In progress';
        date.appendChild(live);
    }
    const del = document.createElement('button');
    del.className = 'match-delete';
    del.innerText = 'Delete';
    del.onclick = () => deleteMatch(match.id);
    info.append(date, del);
    wrap.appendChild(info);
    wrap.appendChild(buildLineScore(match));
    return wrap;
}

// Box score grid: a row per team, a column per set, set winners in bold.
// match = { teamA, teamB, sets: [{ a, b }], ended }. The match winner is bold only once ended.
function buildLineScore(match) {
    const table = document.createElement('table');
    table.className = 'line-score';
    const columns = Math.max(3, match.sets.length);
    const won = setsWon(match.sets);

    // Header row: Team | 1 | 2 | 3 | Sets
    const head = table.insertRow();
    const addHeader = (text, cls) => {
        const th = document.createElement('th');
        th.innerText = text;
        if (cls) th.className = cls;
        head.appendChild(th);
    };
    addHeader('Team', 'team-col');
    for (let i = 1; i <= columns; i++) addHeader(String(i));
    addHeader('Sets', 'sets-col');

    // One row per team
    [['a', 'b', match.teamA, 'blue'], ['b', 'a', match.teamB, 'red']].forEach(([me, them, name, color]) => {
        const row = table.insertRow();
        const wonMatch = match.ended && won[me] > won[them];

        const nameCell = row.insertCell();
        nameCell.className = 'team-col' + (wonMatch ? ' win' : '');
        const dot = document.createElement('span');
        dot.className = 'team-dot';
        dot.style.background = color;
        nameCell.append(dot, name);

        for (let i = 0; i < columns; i++) {
            const cell = row.insertCell();
            const set = match.sets[i];
            if (set) {
                cell.innerText = set[me];
                if (set[me] > set[them]) cell.className = 'win';
            }
        }

        const setsCell = row.insertCell();
        setsCell.className = 'sets-col' + (wonMatch ? ' win' : '');
        setsCell.innerText = won[me];
    });

    return table;
}

function deleteMatch(id) {
    if (!confirm('Delete this match from history?')) return;
    saveHistory(loadHistory().filter(m => m.id !== id));
    if (id === currentMatchId) {
        currentMatchId = null;
        setNumber = 1;
        updateSetLabel();
        saveState();
    }
    renderHistory();
}

// Close the End Set box or History by tapping outside it
document.getElementById('finalOverlay').addEventListener('click', function(event) {
    if (event.target === this) {
        closeFinalSet();
    }
});
document.getElementById('historyPage').addEventListener('click', function(event) {
    if (event.target === this) {
        closeHistory();
    }
});


// Side Out / Rally switch in the menu. The hidden <select> keeps the value.
function setScoringType(type) {
    const select = document.getElementById('scoringType');
    select.value = type;
    select.dispatchEvent(new Event('change')); // saves state
    updateScoringButtons();
}

function updateScoringButtons() {
    const type = document.getElementById('scoringType').value;
    document.getElementById('scoreTypeSideout').classList.toggle('active', type === 'sideout');
    document.getElementById('scoreTypeRally').classList.toggle('active', type === 'rally');
}

// Version stamp at the bottom of the menu (APP_VERSION is set in index.html)
document.getElementById('appVersion').innerText =
    'Version ' + (typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'unknown');

loadState();

// A match left open from an earlier day is finished
if (currentMatchId !== null) {
    const openMatch = loadHistory().find(m => m.id === currentMatchId);
    if (!openMatch || openMatch.day !== todayKey()) {
        closeCurrentMatch();
        saveState();
    }
}
updateSetLabel();
updateScoringButtons();
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
