'use strict';
angular.module('moneyApp')
.controller('UtilCtrl', ['$http', '$state', 'authService', function($http, $state, authService) {
    var ctrl = this;

    if (!authService.isLoggedIn()) {
    	$state.go('home');
    }

    this.logOut = function() {
    	authService.logOut();
    }

    this.exchangeRate = function() {
    	$state.go('exchangeRate');
    }
}]);