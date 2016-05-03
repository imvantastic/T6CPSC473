//Game

function Game(host){
   this.host = host;
   this.players = [];
   this.storyid = 0;
   this.finishedstory = "";
}

//story id
Game.prototype.getStoryId = function(){
	return this.storyid;
}

Game.prototype.updateStoryId = function(storyid){
	this.storyid = storyid;
}

//finished story methods
Game.prototype.getFinishedStory = function(){
	return this.finishedstory;
}

Game.prototype.updateFinishedStory = function(finishedstory){
	this.finishedstory = finishedstory;
}


//game player methods
Game.prototype.addPlayer = function(playerid) {
	this.players.push(playerid);
}

Game.prototype.removePlayer = function(playerid) {
	for (var i = 0; i < this.players.length; i++) {
		if (playerid === this.players[i].playerid) {
			this.players.splice(i, 1);
			return true;
		}
	}
	return false;
}

module.exports = Game;