'use strict';
angular.module('moneyApp')
.controller('ExchangeRateCtrl', ['$http', '$state', 'serverService', function($http, $state, serverService) {
	var ctrl = this;

	this.isPending = false;
    this.isNotify = false;
    this.notifyMsg = "";

    this.data = [];

    this.showNotify = function(msg) {
    	ctrl.notifyMsg = msg;
    	ctrl.isNotify = true;
    }

    this.pending = function(mode) {
        ctrl.isPending = mode;
    }

    this.cancel = function() {
    	$state.go('util');
    }

    this.loadData = function() {
    	ctrl.pending(true);

    	var reqUrl = serverService.addr + '/craw';
    	$http.get(reqUrl).success(function(data) {
    		if (data.error) {
    			ctrl.showNotify('Không tải được thông tin');
    		}
    		else {
    			ctrl.data = data.success.data;
    		}

    		ctrl.pending(false);
    	}).error(function(err) {
    		ctrl.showNotify('Có lỗi xảy ra');
    		ctrl.pending(false);
    	});
    }

    this.init = function() {
    	this.loadData();
    }

    this.init();
}]);