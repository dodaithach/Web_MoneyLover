'use strict';
angular.module('moneyApp')
.service('authService', ['$rootScope', '$http', '$window', '$state', '$timeout', 'serverService', function($rootScope, $http, $window, $state, $timeout, serverService) {
	console.log('autheService loaded');
	var service = this;

	this.walletList = [];
	this.userInfo = {};

	this.saveUserInfo = function(data) {
		service.userInfo = data;

		$window.localStorage['love-money-app-userId'] = service.userInfo._id;
		$window.localStorage['love-money-app-avatar'] = service.userInfo.avatar;
		$window.localStorage['love-money-app-mail'] = service.userInfo.mail;
		$window.localStorage['love-money-app-name'] = service.userInfo.name;
		$window.localStorage['love-money-app-token'] = service.userInfo.token;
	}

	this.getUserInfo = function() {
		if (!angular.equals(service.userInfo, {}))
			return service.userInfo;

		service.userInfo._id = $window.localStorage['love-money-app-userId'];
		service.userInfo.avatar = $window.localStorage['love-money-app-avatar'];
		service.userInfo.mail = $window.localStorage['love-money-app-mail'];
		service.userInfo.name = $window.localStorage['love-money-app-name'];
		service.userInfo.token = $window.localStorage['love-money-app-token'];

		return service.userInfo;
	}

	this.getToken = function() {
		return $window.localStorage['love-money-app-token'];
	}

	this.addWallet = function(wallet) {
		service.walletList.push(wallet);
	}

	this.setWalletList = function(data) {
		service.walletList = data;
	}

	this.getWalletList = function() {
		return service.walletList;
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

	this.clearData = function() {
		service.walletList = [];
	}

	this.clearLocalStorage = function() {
		$window.localStorage.removeItem('love-money-app-userId');
		$window.localStorage.removeItem('love-money-app-avatar');
		$window.localStorage.removeItem('love-money-app-mail');
		$window.localStorage.removeItem('love-money-app-name');
		$window.localStorage.removeItem('love-money-app-token');
	}

	this.logIn = function(user) {
		var reqURL = serverService.addr + '/users';
		return $http.post(reqURL, user);
	}

	this.logOut = function() {
		service.clearData();
		service.userInfo = {};
		service.clearLocalStorage();

		var params = {
			'client_id': '799105536867-8tcdqtmv7krhgfh4tat9ch1b226t4kc7.apps.googleusercontent.com'
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