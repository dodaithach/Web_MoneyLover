'use strict';
angular.module('moneyApp')
.service('walletService', ['$window', function($window) {
	var service = this;

	this.currentWallet = {};

	this.setWallet = function(data) {
		service.currentWallet = data;

		$window.localStorage['love-money-app-wallet-id'] = service.currentWallet._id;
		$window.localStorage['love-money-app-wallet-money'] = service.currentWallet.money;
		$window.localStorage['love-money-app-wallet-name'] = service.currentWallet.name;
		$window.localStorage['love-money-app-wallet-userId'] = service.currentWallet.user_id;
	}

	this.getWallet = function() {
		if (!angular.equals(service.currentWallet, {})) {
			return service.currentWallet;
		}

		service.currentWallet._id = $window.localStorage['love-money-app-wallet-id'];
		service.currentWallet.money = $window.localStorage['love-money-app-wallet-money'];
		service.currentWallet.name = $window.localStorage['love-money-app-wallet-name'];
		service.currentWallet.user_id = $window.localStorage['love-money-app-wallet-userId'];

		return service.currentWallet;
	}
}]);