/**
 * Atlas - Mid Sweden University education database
 * This class represents a very, very simplified version of Atlas with create,
 * read, update, and delete (CRUD) methods for courses and student grades at Miun
 * Almost all methods return a Promise that is fulfilled with the requested data 
 * or rejected if an error occurs.
 */
export class Atlas {
	#dataSource;

	/**
	 * Create a new Atlas instance with the specified source for its data.
	 * @param dataSource the data source to be used
	 */
	constructor(dataSource) {
		this.#dataSource = dataSource;
	}

	/**
	* Get all Miun courses from Atlas.
	* @return a Promise that resolves to an array of courses
	*/
	async getTeams() {
		return this.#dataSource.getTeams();
	}

	async getPlayers() {
		return this.#dataSource.getPlayers();
	}
	/**
	* Get the My course with the specified course code from the REST API.
	* @param teamName the course code of the course to get
	* @return a Promise that resolves to a My course object or {} if the course doesn't exist
	*/
	async getPlayersFromTeam(teamName) {
		console.log(teamName)
		return this.#dataSource.getPlayersFromTeam(teamName);
	}

}
