'use strict';
angular.module('moneyApp')
.controller('TransactionCtrl', ['$http', '$state', function($http, $state) {
    console.log('TransactionCtrl loaded');
    var ctrl = this;

    this.typeList = ['a','b'];
    this.type = {};
}]);