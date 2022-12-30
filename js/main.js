import { Atlas } from './atlas.js';
import { RESTDataSource } from './rest-data-source.js';

/** The data source for our Atlas */

const dataSource = new RESTDataSource("https://jasv2000-project-backend-dt190g.azurewebsites.net");
/** The Atlas instance */
const atlas = new Atlas(dataSource);

/** The name of the page displaying the list of teams */
const team_page = "team.html";

/** The name of the page displaying player */
const player_page = "player.html";

/** The name of the page curretly beeing displayed */
let currentPage = "index.html";

let startPage = "index.html";


let players = [];
let teams = [];

let teamName;
let playerName;


async function starterFunction() {
	currentPage = window.location.pathname.split("/").find(str => str.includes(".html"));



    // om det är teampage skapas tabellen av players och team hämtas.
    // else, tabellerna skapas av teams och players hämtas
    if(currentPage == team_page){
        const teamPromiste = await atlas.getTeams();
        teams = teamPromiste;
        teamName = parseURLParams();
        document.getElementById("teamName").innerHTML= teamName;
        
        const playerPromise = atlas.getPlayers();
        playerPromise
	.then(fetchedTeams => {
		players = fetchedTeams
        createTable();
	})
    }
    else if(currentPage == player_page){
        const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
        playerName = urlParams.get('player')
        
        document.getElementById("playerName").innerHTML= playerName;
        const playerPromise = atlas.getPlayers();
        playerPromise
	.then(fetchedTeams => {
		players = fetchedTeams
        createPlayerInformation(players, playerName);
	})}
    else
    {
        const playerPromise = await atlas.getPlayers();
        players = playerPromise;
        
        const teamPromiste = atlas.getTeams();
        teamPromiste
	.then(fetchedTeams => {
		teams = fetchedTeams
        createTable();
	})
    }

	
}

// Parse function. Use search property of the location to get search string (query string).
//URLSearchParam parse out the parameters from the querystring and the search string
// (teamName on this occation) gets returned.
function parseURLParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const teamName = urlParams.get('team')
    return teamName;
}

function createTable() {

	const table = document.getElementById("teams_table");
	table.innerHTML = null;


    const selectElement = document.createElement("select");
			selectElement.id = "select_" + teams.teamName;

    if (currentPage == team_page){
        createTableForPlayers(players, table)
    }
    else{
        createTableForTeams(teams, table)
    }
}

function createPlayerInformation(players, playerName){
    
    for(let i = 0; i < players.length; i++){
        if (players[i].name == playerName){
            var element = document.getElementById('player-information');
            var pName = document.createElement('p');
            var pAge= document.createElement('p');
            var pTeamName = document.createElement('p');
            var pPosition = document.createElement('p');
            var pNumber = document.createElement('p');
            var pBirthPlace = document.createElement('p');
            var pLenght = document.createElement('p');
            var pWeight = document.createElement('p');
            var pShooter = document.createElement('p');
            var pYouthTeam = document.createElement('p');
            var pContract = document.createElement('p');

            // create image on top of page
            var imageElement = document.getElementById('image');
            var image = document.createElement('img');
            fetch('/images/'+players[i].teamName+'.avif', { method: 'HEAD' })
               .then(res => {
                 if (res.ok) {
                    image.src = '/images/'+players[i].teamName+'.avif';
                  } else {
                    image.src = '/images/ishockey.jpg';
                }
            }).catch(err => console.log('Error:', err));
            imageElement.appendChild(image);

            pName.innerHTML = 'Namn: ' + playerName;
            pAge.innerHTML = 'Ålder: ' + players[i].born;
            pTeamName.innerHTML = 'Lag: ' + players[i].teamName;
            
            pPosition.innerHTML = 'Position: ' + players[i].position;
            pNumber.innerHTML = 'Tröjnummer: ' + players[i].number;
            pBirthPlace.innerHTML = 'Nationalitet: ' + players[i].birthplace;
            if (players[i].length != null){
                pLenght.innerHTML = 'Längd: ' + players[i].length;
            }
            else{
                pLenght.innerHTML = 'Längd: Ingen information';
            }

            if (players[i].weight != null){
                pWeight.innerHTML = 'Vikt: ' + players[i].weight;
            }
            else{
                pWeight.innerHTML = 'Vikt: Ingen information';
            }
            
            if(players[i].shoots == null){
                pShooter.innerHTML = 'Skjuter från: Ingen information'
            }
            else if (players[i].position == "Målvakt"){
                pShooter.innerHTML = 'Plockar med: ' + players[i].shoots;
            }
            else{
                pShooter.innerHTML = 'Skjuter från: ' + players[i].shoots;
            }

            if (players[i].youthTeam != null){
                pYouthTeam.innerHTML = 'Ungdomslag: ' + players[i].youthTeam;
            }
            else{
                pYouthTeam.innerHTML = 'Ungdomslag: Ingen information';
            }
            
            pContract.innerHTML = 'Kontrakt till: ' + players[i].contract;
            
            
            element.appendChild(pName);
            element.appendChild(pTeamName);
            element.appendChild(pAge);
            element.appendChild(pPosition);
            element.appendChild(pNumber);
            element.appendChild(pBirthPlace);
            element.appendChild(pLenght);
            element.appendChild(pWeight);
            element.appendChild(pShooter);
            element.appendChild(pYouthTeam);
            element.appendChild(pContract);
        };

    }

}

function createTableForPlayers(players, table) {

	players.forEach(player => {
        document.getElementById("addPlayer").addEventListener("click", addPlayer);
        if (player.teamName == teamName){
            const tr = document.createElement("tr");
            createTd(player.name, tr, element => element.innerHTML='<a class="nav-link" href="player.html?player='+player.name+'">'+player.name+'</a>');
            createTd(player.number, tr);
            createTd(player.birthplace, tr);

            const deleteButton = document.createElement("span");
            deleteButton.className += "button delete";
            deleteButton.innerText = "Radera";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", (_) => deletePlayer(player.playerId))
  
        
        tr.appendChild(deleteButton);
            
            table.appendChild(tr);
            
        }
        
	});

    teams.forEach(team => {
        if (team.teamName == teamName){
            var element = document.getElementById('team-information');
            var imageElement = document.getElementById('team-image');
            var pTeamName = document.createElement('p');
            var pCreated = document.createElement('p');
            var pLocation = document.createElement('p');
            var pArena = document.createElement('p');
            var pSMGolds = document.createElement('p');
            var pHeadCoach = document.createElement('p');
            var pDivision = document.createElement('p');
            var image = document.createElement('img');
          
            fetch('/images/'+teamName+'.avif', { method: 'HEAD' })
               .then(res => {
                 if (res.ok) {
                    image.src = '/images/'+teamName+'.avif';
                  } else {
                    image.src = '/images/ishockey.jpg';
                }
            }).catch(err => console.log('Error:', err));

            
            pTeamName.innerHTML = 'Namn: ' + teamName;
            pCreated.innerHTML = 'Grundad: ' + team.created;
            pLocation.innerHTML = 'Stad: ' + team.location;

            if (team.arena != null){
                pArena.innerHTML = 'Arena: ' + team.arena;
            }
            else{
                pArena.innerHTML = 'Arena: Ingen information';
            }

            if (team.SMgolds != null){
                pSMGolds.innerHTML = 'SM-guld: ' + team.SMgolds;
            }
            else{
                pSMGolds.innerHTML = 'SM-guld: Ingen information';
            }
            
            if (team.headCoach != null){
                pHeadCoach.innerHTML = 'Huvudtränare: ' + team.headCoach;
            }
            else{
                pHeadCoach.innerHTML = 'Huvudtränare: Ingen information';
            }
   
           
            pDivision.innerHTML = 'Division: ' + team.division;
            imageElement.appendChild(image);
            element.appendChild(pTeamName);
            element.appendChild(pCreated);
            element.appendChild(pLocation);
            element.appendChild(pArena);
            element.appendChild(pSMGolds);
            element.appendChild(pHeadCoach);
            element.appendChild(pDivision);
            element.appendChild(pDivision);

            
        }
        
		
	}); 
}
/**
* Create table rows for all teams in the array.
* @param teams an array of teams to create table rows for
* @param table the table or the table body to add the rows to
*/
function createTableForTeams(teams, table) {
	
	teams.forEach(team => {

		const tr = document.createElement("tr");
        createTd(team.teamName, tr, element => element.innerHTML='<a class="nav-link" href="team.html?team='+team.teamName+'">'+team.teamName+'</a>');
		createTd(team.location, tr);
		createTd(team.division, tr);
        const deleteButton = document.createElement("span");
        deleteButton.className += "button delete";
        deleteButton.innerText = "Radera";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", (_) => deleteTeam(team.organisationNumber))
        document.getElementById("addTeam").addEventListener("click", addTeam);
        
        tr.appendChild(deleteButton);

		table.appendChild(tr);
	});
}
function deleteTeam(organisationNumber){
	atlas.deleteTeam(organisationNumber)
	teams = teams.filter(team => team.organisationNumber != organisationNumber)
	createTable();
}

function deletePlayer(playerId){
	atlas.deletePlayer(playerId)
	players = players.filter(player => player.playerId != playerId)
	//createTable();
}
function addTeam(){
	
	const teamName = document.getElementById("teamName").value;
	const created = document.getElementById("created").value;
    const location = document.getElementById("location").value;
    const arena = document.getElementById("arena").value;
    const organisationNumber = document.getElementById("organisationNumber").value;
    const SMgolds = document.getElementById("SMgolds").value;
    const headCoach = document.getElementById("headCoach").value;
    const division = document.getElementById("division").value;


	atlas.addTeam(teamName, created, location, arena, organisationNumber, headCoach, division, SMgolds)

}

function addPlayer(){
	console.log(teamName);
	const name = document.getElementById("playerName").value;

    const position = document.getElementById("position").value;
    const number = document.getElementById("number").value;
    const born = document.getElementById("born").value;
    const birthplace = document.getElementById("birthplace").value;
    const length = document.getElementById("length").value;
    const weight = document.getElementById("weight").value;
    const shoots = document.getElementById("shoots").value;
    const playerId = document.getElementById("playerId").value;
    const youthTeam = document.getElementById("youthTeam").value;
    const contract = document.getElementById("contract").value;

	atlas.addPlayer(name, teamName, position, number, born, birthplace, length, weight, shoots, playerId, youthTeam, contract)

}

/**
* Create a data cell (td element) with the specified text
* @param text the text to to be displayed in the data cell
* @param tr the table row to add the data cell to
* @param extra a lambda that handles any extra that needs to be added to the data cell
*/
function createTd(text, tr, extra) {
	const td = document.createElement("td");
	td.innerText = text;
	
	if (extra) {
		extra(td);
	}

	tr.appendChild(td);
}


document.addEventListener('DOMContentLoaded', starterFunction);
