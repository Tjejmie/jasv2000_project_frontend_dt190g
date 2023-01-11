import { Atlas } from './atlas.js';
import { RESTDataSource } from './rest-data-source.js';

/** The data source for our Atlas */
const dataSource = new RESTDataSource("https://jasv2000-project-backend-dt190g.azurewebsites.net");

/** The Atlas instance */
const atlas = new Atlas(dataSource);

/** The name of the page displaying team information and list of players of that team */
const team_page = "team.html";

/** The name of the page displaying specific player information */
const player_page = "player.html";

/** The name of the page curretly beeing displayed */
let currentPage = "index.html";

/** The name of the page displaying all players */
const allPlayerPage = "allPlayers.html";

/** Array of player fetched from REST API */
let players = [];
/** Array of teams fetched from REST API */
let teams = [];

let teamName;
let playerName;

/** Starter function of the app 
 * Get current page and depending on the page get players or teams
 * from atlas and crate table/show information */
async function starterFunction() {
    //Get current page
	currentPage = window.location.pathname.split("/").find(str => str.includes(".html"));

    // If current page is team_page
    if(currentPage == team_page){
        const teamPromiste = await atlas.getTeams();
        teams = teamPromiste;
        // Get teamName from URL
        teamName = parseURLParams();
        // Set title to teamName
        document.getElementById("teamName").innerHTML= teamName;
        getPlayersAndCreateTable();
    }
    // If current page is player_page
    else if(currentPage == player_page){
        // Get playerName from URL
        playerName = parseURLParams();
        // Set title to playerName
        document.getElementById("playerName").innerHTML= playerName;
        // Get players from atlas
        const playerPromise = atlas.getPlayers();
        playerPromise
	.then(fetchedTeams => {
		players = fetchedTeams
        displayPlayerInformation(players, playerName);
	}).catch(error => console.error(`An error occurd when getting players from Atlas: ${error}`));}
    // If current page is allPlayerPage
    else if(currentPage == allPlayerPage){
        getPlayersAndCreateTable();
	}
    // else (if page is index)
    else
    {
        const playerPromise = await atlas.getPlayers();
        players = playerPromise;
        getTeamsAndCreateTable();
    }
}

/** Function to get list of teams from atlas and create table */
function getTeamsAndCreateTable(){
    const teamPromiste = atlas.getTeams();
        teamPromiste
	.then(fetchedTeams => {
		teams = fetchedTeams
        createTable();

})
.catch(error => console.error(`An error occurd when getting teams from Atlas: ${error}`));};

/** Function to get list of players from atlas and create table */
function getPlayersAndCreateTable(){
    const playerPromise = atlas.getPlayers();
        playerPromise
	.then(fetchedTeams => {
		players = fetchedTeams
        createTable();
})
.catch(error => console.error(`An error occurd when getting players from Atlas: ${error}`));};
    

/** Parse function. Use search property of the location to get search string (query string)
 * URLSearchParam parse out the parameters from the querystring and the search string
 * (returnString on this occation) gets returned.
 * @return search string from URL */
function parseURLParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let returnString;
    if(currentPage == team_page){
        returnString = urlParams.get('team')
    }
    else if(currentPage == player_page){
        returnString = urlParams.get('player')
    }
    return returnString;
}

/** Function to create table depending on current page */
function createTable() {
    // Get table and clear any existing data in the table
	const table = document.getElementById("teams_or_players_table");
	table.innerHTML = null;

    // Check current page and create table depending on page
    if (currentPage == team_page){
        // Create table with players for specific team
        createTableForPlayers(players, table);
        // Display information about the team
        displayTeamInformation();
    }
    else if(currentPage == allPlayerPage){
        createTableForAllPlayers(players, table);
    }
    else{
        createTableForTeams(teams, table);
    }
}

/** Function to display information about the team */
function displayTeamInformation(){
    // Loop through list of teams and find the team that was clicked on
    teams.forEach(async team => {
        if (team.teamName == teamName){
            // Create elements to show information on
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
    
            // Load team image
            loadImage(image, teamName);

            // Set text in elements. Display information if it exists
            // or "Ingen information"
            pTeamName.innerHTML = 'Namn: ' + teamName;
            pCreated.innerHTML = 'Grundad: ' + team.created;
            pLocation.innerHTML = 'Stad: ' + team.location;

            if (team.arena == null || team.arena == ""){
                pArena.innerHTML = 'Arena: Ingen information';
            }
            else{
                pArena.innerHTML = 'Arena: ' + team.arena;
            }

            if (team.SMgolds == null || team.SMgolds == ""){
                pSMGolds.innerHTML = 'SM-guld: Ingen information';
            }
            else{
                pSMGolds.innerHTML = 'SM-guld: ' + team.SMgolds;
            }
            
            if (team.headCoach == null || team.headCoach == ""){
                pHeadCoach.innerHTML = 'Huvudtränare: Ingen information';
            }
            else{
                pHeadCoach.innerHTML = 'Huvudtränare: ' + team.headCoach;
            }

            pDivision.innerHTML = 'Division: ' + team.division;

            // Add all elements to main element
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

/** Function to create table for players on specific team 
 * @param players array with all the players that exist in atlas
 * @param table the table or the table body to add the rows to
 */
function createTableForPlayers(players, table) {
    // Add event listener to addPlayer button in form
    document.getElementById("addPlayer").addEventListener("click", addPlayer);
    // For each player that match teamName create a table row with player data
	players.forEach(player => {
        if (player.teamName == teamName){
            // Make a table row
            const tr = document.createElement("tr");
            // Populate the row with the data to display
            createTd(player.name, tr, element => element.innerHTML='<a class="nav-link" href="player.html?player='+player.name+'">'+player.name+'</a>');
            createTd(player.number, tr);
            createTd(player.birthplace, tr);
            // Create delete button
            const deleteButton = document.createElement("span");
            deleteButton.className += "button delete";
            deleteButton.innerText = "Radera";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", (_) => deletePlayer(player.playerId))
  
            // Add the row to the table
            tr.appendChild(deleteButton);
            table.appendChild(tr);
        }
	});
}

/** Function to create table for all players 
 * @param players array with all the players that exist in atlas
 * @param table the table or the table body to add the rows to
 */
function createTableForAllPlayers(players, table) {
    // For each player create a table row with player data
	players.forEach(player => {
            // Make a table row
            const tr = document.createElement("tr");
            // Populate the row with the data to display
            createTd(player.name, tr);
            createTd(player.teamName, tr);
            createTd(player.birthplace, tr);
            // Add the row to the table
            table.appendChild(tr);
	});
}

/** Function to display player information 
 * @param players array with all the players that exist in atlas
 * @param playerName name of the player whose information is to be displayed
 */
async function displayPlayerInformation(players, playerName){
    // Loop through all players to find specific player and get player information
    for(let i = 0; i < players.length; i++){
        if (players[i].name == playerName){
             // Create elements to show information on
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
            
            // Create dropdown menu with all teams
            const selectElement = document.getElementById("teams");
            teams = await atlas.getTeams();
            createTeamNameOptions(selectElement, teams, players[i].teamName);

            // Get image
            var imageElement = document.getElementById('image');
            var image = document.createElement('img');
            loadImage(image, players[i].teamName);
            imageElement.appendChild(image);

            // Set text in elements. Display information if it exists
            // or "Ingen information"
            pName.innerHTML = 'Namn: ' + playerName;
            if (players[i].born == null || players[i].born == ""){
                pAge.innerHTML = 'Ålder: Ingen information';
            }
            else{
                pAge.innerHTML = 'Ålder: ' + players[i].born;
            }
            pTeamName.innerHTML = 'Lag: ' + selectElement.value;
            pPosition.innerHTML = 'Position: ' + players[i].position;
            pNumber.innerHTML = 'Tröjnummer: ' + players[i].number;
            pBirthPlace.innerHTML = 'Nationalitet: ' + players[i].birthplace;
            if (players[i].length == null || players[i].length == ""){
                pLenght.innerHTML = 'Längd: Ingen information';
            }
            else{
                pLenght.innerHTML = 'Längd: ' + players[i].length;
            }

            if (players[i].weight == null || players[i].weight == ""){
                pWeight.innerHTML = 'Vikt: Ingen information';
            }
            else{
                pWeight.innerHTML = 'Vikt: ' + players[i].weight;
            }
            
            if(players[i].shoots == null || players[i].shoots == ""){
                pShooter.innerHTML = 'Skjuter från: Ingen information'
            }
            else if (players[i].position == "Målvakt"){
                pShooter.innerHTML = 'Plockar med: ' + players[i].shoots;
            }
            else{
                pShooter.innerHTML = 'Skjuter från: ' + players[i].shoots;
            }

            if (players[i].youthTeam == null || players[i].youthTeam == ""){
                pYouthTeam.innerHTML = 'Ungdomslag: Ingen information';
            }
            else{
                pYouthTeam.innerHTML = 'Ungdomslag: ' + players[i].youthTeam;
            }

            if (players[i].contract == null || players[i].contract == ""){
                pContract.innerHTML = 'Kontrakt till: Ingen information';
            }
            else{
                pContract.innerHTML = 'Kontrakt till: ' + players[i].contract;
            }
            
            
            // Add all elements to main element
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

            var changeTeamElement = document.getElementById('changeTeam');
            var h2Element = document.createElement('h2');
            h2Element.innerHTML = 'Ändra spelarens lag: ';
            // Event listener on selectElement. If teamname in dropdown-menu is changed, the players
            // team will be changed.
            selectElement.addEventListener("change", option => {
                atlas.updatePlayer(players[i].playerId, option.target.value);
            });

            // Add all elements to main element
            changeTeamElement.appendChild(h2Element);
            changeTeamElement.appendChild(selectElement);
        };
    }
}

/** Function to set image source. Team image is displayed as default, if that can not
 * be found a default image will be set
 * @param image img element that is created
 * @param teamName name of the team whose image is to be displayed
 */

function loadImage(image, teamName){
    teamName = teamName.toLowerCase();
    fetch('./images/'+teamName+'.avif', { method: 'HEAD' })
               .then(res => {
                 if (res.ok) { // If team image exist
                    image.src = './images/'+teamName+'.avif';
                  } else { // Team image does not exist. Set default image
                    image.src = './images/ishockey.jpg';
                }
            }).catch(err => console.log('Error:', err));
}


/**
* Create table rows for all teams in the array.
* @param teams an array of teams to create table rows for
* @param table the table or the table body to add the rows to
*/
function createTableForTeams(teams, table) {
    // get all leagues
	atlas.getLeagues().then(league => {
    // For each team create a table row with team data
	teams.forEach(team => {
        // Make a table row
		const tr = document.createElement("tr");
        // Populate the row with the data to display
        createTd(team.teamName, tr, element => element.innerHTML='<a class="nav-link" href="team.html?team='+team.teamName+'">'+team.teamName+'</a>');
		createTd(team.location, tr);
		
        const td = document.createElement("td");
			td.classList.add("center");
        // Create delete button to delete team
        const deleteButton = document.createElement("span");
        deleteButton.className += "button delete";
        deleteButton.innerText = "Radera";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", (_) => deleteTeam(team.organisationNumber))

        // Event listener on span to add team
        document.getElementById("addTeam").addEventListener("click", addTeam);

        // Create dropdown menu with all leagues
        const selectElement = document.createElement("select");
			selectElement.id = "select_" + team.organisationNumber;
        createLeagueOptions(selectElement, league, team.division);

        // Event listener on selectElement. If league in dropdown-menu is changed, the teams
        // league will be changed.
        selectElement.addEventListener("change", option => {
            atlas.updateTeam(team.organisationNumber, option.target.value);
        });
        
        td.appendChild(selectElement);
        tr.appendChild(td);
        tr.appendChild(deleteButton);
        // Add the row to the table
		table.appendChild(tr);
	});});
}

/** Function to delete a team and all its players
 * @param organisationNumber organisationnumber on the team that is being deleted
 */
function deleteTeam(organisationNumber){
    var teamName;
    // Get teamname of the team that has the organisationNumber
    for(let i = 0; i < teams.length; i++){
        if(teams[i].organisationNumber == organisationNumber){
            teamName = teams[i].teamName;
        }
    }
    // Loop through all players and see if there is any players that has this teamName.
    // if so, the player/players are deleted
    for(let i = 0; i < players.length; i++){
        if(players[i].teamName == teamName){
            atlas.deletePlayer(players[i].playerId)
        }
    }
    // Delete team
	atlas.deleteTeam(organisationNumber)

    // Remove team from arraylist and update table
	teams = teams.filter(team => team.organisationNumber != organisationNumber)
	createTable();
}

/** Function to delete a player
 * @param playerId playerId on the player that is being removed
 */
function deletePlayer(playerId){
	atlas.deletePlayer(playerId)
}

/** Function to add a team */
function addTeam(){
	// get all information from the form
	const teamName = document.getElementById("teamName").value;
	const created = document.getElementById("created").value;
    const location = document.getElementById("location").value;
    const arena = document.getElementById("arena").value;
    const organisationNumber = document.getElementById("organisationNumber").value;
    const SMgolds = document.getElementById("SMgolds").value;
    const headCoach = document.getElementById("headCoach").value;
    const division = document.getElementById("division").value;

    // Add team and send all information from the form to atlas
	atlas.addTeam(teamName, created, location, arena, organisationNumber, headCoach, division, SMgolds)

}

/** Function to add a player */
function addPlayer(){
    // get all information from the form
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
    
    // Add player and send all information from the form to atlas
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

/**
* Create option elements for the specified select element.
* @param selectElement the select element to create and add option elements for
* @param leagues an array of leagues to create option elements for
* @param selectedLeague the league to be the selected option in the selectElement
*/
function createLeagueOptions(selectElement, leagues, selectedLeague) {
	
	for (const val of leagues)
    {
		var option = document.createElement("option");
        option.text = val.charAt(0).toUpperCase() + val.slice(1);
		selectElement.appendChild(option);
		selectElement.value = selectedLeague;
    }
}

/**
* Create option elements for the specified select element.
* @param selectElement the select element to create and add option elements for
* @param teams an array of teams to create option elements for
* @param selectedTeam the team to be the selected option in the selectElement
*/
function createTeamNameOptions(selectElement, teams, selectedTeam) {
	
	for (const val of teams)
    {
		var option = document.createElement("option");
        option.text = val.teamName;
		selectElement.appendChild(option);
		selectElement.value = selectedTeam;
    }
	
}

document.addEventListener('DOMContentLoaded', starterFunction);
