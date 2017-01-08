'use strict';
angular.module('moneyApp')
.service('socket', ['authService', function(authService) {
	var service = this;

	// this.socket = io.connect('http://knchitieu-baymax13cntn.rhcloud.com/');

	this.init = function() {
		service.socket.on('socketID', function(data) {
			console.log('socket on: socketID');
			console.log(data);
			// authService.saveSocketId();
		});
	}

	this.getSocket = function() {
		return service.socket;
	}
}]);