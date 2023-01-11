/**
 * Atlas - Swedish hockeyleagues database
 * This class represents a very, very simplified version of Atlas with create,
 * read, update, and delete (CRUD) methods for teams and players
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
	* Get all Teams from Atlas.
	* @return a Promise that resolves to an array of teams
	*/
	async getTeams() {
		return this.#dataSource.getTeams();
	}

	/**
	* Get all Players from Atlas.
	* @return a Promise that resolves to an array of players
	*/
	async getPlayers() {
		return this.#dataSource.getPlayers();
	}

	/**
	* Delete a team from Atlas.
	* @param organisationNumber the organisationNumber for the team to be deleted
	* @return a Promise that resolves to the team deleted or an error 
	*         message explaining why the team couldn't be deleted
	*/
	async deleteTeam(organisationNumber) {
		return this.#dataSource.deleteTeam(organisationNumber);
	}

	/**
	* Delete a player from Atlas.
	* @param playerId the playerId for the player to be deleted
	* @return a Promise that resolves to the player deleted or an error 
	*         message explaining why the player couldn't be deleted
	*/
	async deletePlayer(playerId) {
		return this.#dataSource.deletePlayer(playerId);
	}

	/**
	* Add a team with a grade to Atlas.
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
		return this.#dataSource.addTeam(teamName, created, location, arena, organisationNumber, headCoach, division, SMgolds);
	}

	/**
	* Add a team with a grade to Atlas.
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
		return this.#dataSource.addPlayer(name, teamName, position, number, born, birthplace, length, weight, shoots, playerId, youthTeam, contract);
	}

	/**
	* Get all leagues from Atlas.
	* @return a Promise that resolves to an array of leagues
	*/
	async getLeagues() {
		return this.#dataSource.getLeagues();
	}

	/**
	* Update the division for a team in Atlas.
	* @param organisationNumber the organisationNumber of the team to update the division for
	* @param division the new division for the team
	* @return a Promise that resolves to the team updated or an error 
	*         message explaining why the teams division couldn't be updated
	*/
	updateTeam(organisationNumber, division) {
		return this.#dataSource.updateTeam(organisationNumber, division);
	}

	/**
	* Update the teamName for a player in Atlas.
	* @param playerId the playerId for the player to update the teamName for
	* @param teamName the new teamName for the player
	* @return a Promise that resolves to the player updated or an error 
	*         message explaining why the players teamName couldn't be updated
	*/
	updatePlayer(playerId, teamName) {
		return this.#dataSource.updatePlayer(playerId, teamName);
	}
}
