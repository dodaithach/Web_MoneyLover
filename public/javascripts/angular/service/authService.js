'use strict';
angular.module('moneyApp')
.service('authService', ['$rootScope', '$http', '$window', '$state', '$timeout', 'serverService', function($rootScope, $http, $window, $state, $timeout, serverService) {
	var service = this;

	this.userInfo = {};

	this.saveToken = function(token) {
		$window.localStorage['love-money-app-token'] = token;
	};

	this.getToken = function() {
		return $window.localStorage['love-money-app-token'];
	}

	this.isLoggedIn = function() {
		var token = service.getToken();

		if (token) {
		  	var decoded = jwt_decode(token);
		  	return decoded.exp > Date.now() / 1000;
		} else {
		  	return false;
		}
	};

	this.logIn = function(user) {
		var reqURL = serverService.addr + '/users';
		return $http.post(reqURL, user);
	}

	this.logOut = function() {
		$window.localStorage.removeItem('love-money-app-token');
		var params = {
			'client_id': '6660450763-r9pjqkams1ngivnio98sjrq3n27bpqe9.apps.googleusercontent.com'
		};

		gapi.load('auth2', function() {
			gapi.auth2.init(params).then(function() {		
				gapi.auth2.getAuthInstance().signOut().then(function () {
					$rootScope.$emit('updateToolbar', -1);
			    });
			});
		});
	}
}])