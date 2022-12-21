import { Atlas } from './atlas.js';
import { RESTDataSource } from './rest-data-source.js';

/** The data source for our Atlas */

const dataSource = new RESTDataSource("https://jasv2000-project-backend-dt190g.azurewebsites.net");
/** The Atlas instance */
const atlas = new Atlas(dataSource);

/** The name of the page displaying the list of My courses */
const team_page = "team.html";

/** The name of the page curretly beeing displayed */
let currentPage = "index.html";


let teams = [];


function starterFunction() {
	currentPage = window.location.pathname.split("/").find(str => str.includes(".html"));

    const teamName = parseURLParams();

	const teamsPromise = currentPage == team_page ? atlas.getPlayers(teamName) : atlas.getTeams();
	teamsPromise
	.then(fetchedTeams => {
		teams = fetchedTeams;
		createTable();
	})
	.catch(error => console.error(`An error occurd when getting teams from Atlas: ${error}`));

    if(currentPage == team_page){
        const teamName = parseURLParams();

        // title to the clicked teamname
        document.getElementById("teamName").innerHTML= teamName;
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

	const tableCreator = currentPage == team_page ? createTableForTeam : createTableForTeams;

	const table = document.getElementById("teams_table");
	table.innerHTML = null;


    const selectElement = document.createElement("select");
			selectElement.id = "select_" + teams.teamName;


	tableCreator(teams, table);
}

function createTableForTeam(teams, table) {
    
	teams.forEach(team => {

		const tr = document.createElement("tr");

		createTd(team.name, tr);
		createTd(team.birthplace, tr);
        createTd(team.length, tr);

		table.appendChild(tr);
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


		//createTd(team.teamName, tr, element => element.addEventListener("click", (_) => click(team.teamName)));
        createTd(team.teamName, tr, element => element.innerHTML='<a class="nav-link" href="team.html?team='+team.teamName+'">'+team.teamName+'</a>');
		createTd(team.location, tr);
		createTd(team.division, tr);

		table.appendChild(tr);
	});
}

// function click(teamName){
//     localStorage.setItem('teamName', teamName);

//     window.location.href = "team.html"
  
// }
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
