'use strict';
angular.module('moneyApp')
.service('timeService', [function() {
	var service = this;

	this.getDateInSecond = function(date) {
		var res = date.getTime();
		res -= date.getHours() * 60 * 60 * 1000;
		res -= date.getMinutes() * 60 * 1000;
		res -= date.getSeconds() * 1000;
		res -= date.getMilliseconds();

		return res / 1000;
	}
}]);