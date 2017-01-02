'use strict';
angular.module('moneyApp')
.controller('ToolbarCtrl', ['$http', '$state', function($http, $state) {
    console.log('ToolbarCtrl loaded');
    var ctrl = this;

    this.titles = ['Tinh hinh chi tieu', 'Thong ke', 'Mo rong'];
    this.id = 0;
    this.state = $state;

    this.goToPage = function(id) {
    	switch (id) {
    		case 0: {
    			ctrl.id = id;
    			$state.go('main');
    			break;
    		}
    		case 1: {
    			ctrl.id = id;
    			$state.go('statistic');
    			break;
    		}
    		case 2: {
    			ctrl.id = id;
    			$state.go('util');
    			break;
    		}
    		default:
    			break;
    	}
    }
}]);