import { DataSource } from "./data-source.js";

/**
 * This class represents a data source where a REST API is used 
 * to get data from.
 * @extends DataSource
 */
export class RESTDataSource extends DataSource {
	/**
	 * Create a new data source with the specified JSON file as its source of data.
	 * @param url the name of the JSON file to be used as source of data
	 */
	constructor(url) {
		super(url);
	}

	/**
 * Get data from the specified endpoint. The endpoint will 
 * be appended to the base URL by the superclass DataSource. Example: 
 * If the base URL is http://localhost:3000 and the endpoint is /api/teams, 
 * the HTTP request will be sent to http://localhost:3000/api/teams.
 * 
 * For any HTTP method but GET, the specified body will be sent with 
 * the request.
 * @param endpoint the endpoint to use, default an empty string ''
 * @param method the HTTP request method to use, default GET
 * @param body the body to be sent with the request, default an empty body {}
 * @return a Promise that resolves with the result of parsing the response 
 * body text as JSON.
 */
	 async getData(endpoint = '', method = 'GET', body = {}) {
		return super.getData(endpoint, method, body) // getData returns a Promise<Response>
		.then(resp => resp.json()); // parses the Response body text as JSON
	}
	
	/**
	* Get all Teams from the REST API.
	* @return a Promise that resolves to an array of teams
	*/
	async getTeams() {
		return this.getData('/api/teams/');
	}

	/**
	* Get all Players from the REST API.
	* @return a Promise that resolves to an array of players
	*/
    async getPlayers() {
		return this.getData('/api/players/');
	}

	/**
	* Delete a team from the REST API.
	* @param organisationNumber the organisationNumber for the team to be deleted
	* @return a Promise that resolves to the team deleted or an error 
	*         message explaining why the team couldn't be deleted
	*/
	async deleteTeam(organisationNumber) {
		return this.getData('/api/teams/'+organisationNumber, 'DELETE')
		|| console.error(error);
	}
	
	/**
	* Add a team with a grade to the REST API.
	* @param teamName the teamName for the team to be added
	* @param created year of when a team was created being added
	* @param location the location for the team to be added
	* @param arena the name of arena for the team to be added
	* @param organisationNumber the organisation number for the team to be added
	* @param headCoach the head coach for the team to be added
	* @param division the division for the team to be added
	* @param SMgolds the amount of SM-golds for the team to be added
	* @return a Promise that resolves to a team object to be added or an error 
	*         message explaining why the team couldn't be added */
	async addTeam(teamName, created, location, arena, organisationNumber, headCoach, division, SMgolds) {

		return this.getData('/api/teams', 'POST', {teamName:teamName, created:created, location:location, arena:arena,
			organisationNumber:organisationNumber, headCoach:headCoach, division:division, SMgolds:SMgolds})
		|| console.error(error);
	}

	/**
	* Add a team with a grade to the REST API.
	* @param name the name for the player to be added
	* @param teamName the name of the team for the player to be added
	* @param position the position for the player to be added
	* @param number the number the player have to be added
	* @param born the date of when the player is born to be added
	* @param birthplace the birthplace for the player to be added
	* @param length the length of the player to be added
	* @param weight the weight of the player to be added
	* @param shoots the shoots of the player to be added
	* @param playerId the playerId for the player to be added
	* @param youthTeam the name of the youth team for the player to be added
	* @param contract the year of when the player have contract to to be added
	* @return a Promise that resolves to a player object to be added or an error 
	*         message explaining why the player couldn't be added */
	async addPlayer(name, teamName, position, number, born, birthplace, length, weight, shoots, playerId, youthTeam, contract) {

		return this.getData('/api/players', 'POST', {name:name, teamName:teamName, position:position, number:number,
			born:born, birthplace:birthplace, length:length, weight:weight, shoots:shoots, 
			playerId:playerId, youthTeam:youthTeam, contract:contract})
		|| console.error(error);
	}

	/**
	* Delete a player from the REST API.
	* @param playerId the playerId for the player to be deleted
	* @return a Promise that resolves to the player deleted or an error 
	*         message explaining why the player couldn't be deleted
	*/
	async deletePlayer(playerId) {
		return this.getData('/api/players/'+playerId, 'DELETE')
		|| console.error(error);
	}

	/**
	* Get all leagues from the REST API.
	* @return a Promise that resolves to an array of leagues
	*/
	async getLeagues() {
		return this.getData('/api/leagues');
	}

	/**
	* Update the division for a team in the REST API.
	* @param organisationNumber the organisationNumber of the team to update the division for
	* @param division the new division for the team
	* @return a Promise that resolves to the team updated or an error 
	*         message explaining why the teams division couldn't be updated
	*/
	updateTeam(organisationNumber, division) {
		return this.getData('/api/teams/'+organisationNumber, 'PUT', {division: division})
		|| console.error(error);
	}

	/**
	* Update the teamName for a player in the REST API.
	* @param playerId the playerId for the player to update the teamName for
	* @param teamName the new teamName for the player
	* @return a Promise that resolves to the player updated or an error 
	*         message explaining why the players teamName couldn't be updated
	*/
	updatePlayer(playerId, teamName) {
		return this.getData('/api/players/'+playerId, 'PUT', {teamName: teamName})
		|| console.error(error);
	}
}
