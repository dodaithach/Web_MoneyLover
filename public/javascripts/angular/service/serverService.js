'use strict';
angular.module('moneyApp')
.service('serverService', [function() {
	this.addr = 'https://knchitieu-baymax13cntn.rhcloud.com/api';
}]);