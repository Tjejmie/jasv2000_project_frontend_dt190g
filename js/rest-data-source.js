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
 * If the base URL is http://localhost:3000 and the endpoint is /api/courses, 
 * the HTTP request will be sent to http://localhost:3000/api/courses.
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
	* Get all teams from the REST API.
	* @return a Promise that resolves to an array of courses
	*/
	async getTeams() {
		return this.getData('/api/teams/');
	}

    async getPlayers() {
		return this.getData('/api/players/');
	}
	async getPlayersFromTeam(teamName) {
		console.log(teamName)
		return this.getData('/api/teams/players/:'+teamName) || {};
	}
	

}
