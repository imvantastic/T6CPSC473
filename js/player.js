function Player(id) {
	this.id = id;
}

//id is socket.id
Player.prototype.getId = function() {
	return this.id;
}

module.exports = Player;