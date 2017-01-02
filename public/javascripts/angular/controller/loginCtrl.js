'use strict';
angular.module('moneyApp')
.controller('LoginCtrl', ['$http', '$state', function($http, $state) {
    console.log('LoginCtrl loaded');
    var ctrl = this;

    this.login = function() {
    	$state.go('main');
    	$state.go('main');
    }
}]);
