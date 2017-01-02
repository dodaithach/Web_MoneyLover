'use strict';
angular.module('moneyApp')
.controller('MainCtrl', ['$http', '$state', function($http, $state) {
    console.log('MainCtrl loaded');
    var ctrl = this;

    this.transactionClicked = function() {
    	$state.go('transaction');
    }
}]);