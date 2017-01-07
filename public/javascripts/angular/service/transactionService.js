'use strict';
angular.module('moneyApp')
.service('transactionService', ['$window', function($window) {
	console.log('transactionService loaded');
	var service = this;

	this.currentTransaction = {};

	this.setTransaction = function(data) {
		service.currentTransaction = data;

		$window.localStorage['love-money-app-trans-id'] = service.currentTransaction._id;
		$window.localStorage['love-money-app-trans-category'] = service.currentTransaction.category_id;
		$window.localStorage['love-money-app-trans-date'] = service.currentTransaction.for_date;
		$window.localStorage['love-money-app-trans-location'] = service.currentTransaction.location;
		$window.localStorage['love-money-app-trans-note'] = service.currentTransaction.note;
		$window.localStorage['love-money-app-trans-price'] = service.currentTransaction.price;
		$window.localStorage['love-money-app-trans-wallet'] = service.currentTransaction.wallet_id;
	}

	this.getTransaction = function() {
		if (!angular.equals(service.currentTransaction, {}))
			return service.currentTransaction;

		service.currentTransaction._id = $window.localStorage['love-money-app-trans-id'];
		service.currentTransaction.category_id = $window.localStorage['love-money-app-trans-category'];
		service.currentTransaction.for_date = $window.localStorage['love-money-app-trans-date'];
		service.currentTransaction.location = $window.localStorage['love-money-app-trans-location'];
		service.currentTransaction.note = $window.localStorage['love-money-app-trans-note'];
		service.currentTransaction.price = $window.localStorage['love-money-app-trans-price'];
		service.currentTransaction.wallet_id = $window.localStorage['love-money-app-trans-wallet'];

		return service.currentTransaction;
	}
}]);