'use strict';
angular.module('moneyApp')
.controller('ToolbarCtrl', ['$rootScope', '$http', '$state', 'authService', function($rootScope, $http, $state, authService) {
    var ctrl = this;

    this.titles = ['Tinh hinh chi tieu', 'Vi tien', 'Mo rong'];
    this.id = 0;
    this.state = $state;

    this.goToPage = function(id) {
        authService.clearData();
        
    	switch (id) {
    		case 0: {
    			ctrl.id = 0;
                $state.go('main');
    			break;
    		}
    		case 1: {
    			ctrl.id = 1;
    			$state.go('wallet');
    			break;
    		}
    		case 2: {
    			ctrl.id = 2;
    			$state.go('util');
    			break;
    		}
    		default: {
                ctrl.id = 0;
                $state.go('home');
                break;
            }
    	}
    }

    $rootScope.$on('updateToolbar', function(event, args) {
        console.log('handle event');
        ctrl.goToPage(args);
    });
}]);