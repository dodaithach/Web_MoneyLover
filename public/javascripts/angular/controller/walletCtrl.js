'use strict';
angular.module('moneyApp')
.controller('WalletCtrl', ['$http', '$state', 'authService', 'serverService', 'walletService', 
							function($http, $state, authService, serverService, walletService) {
	console.log('walletCtrl loaded');
	var ctrl = this;

	if (!authService.isLoggedIn()) {
    	$state.go('home');
    }

    this.isPending = false;
    this.isNotify = false;
    this.notifyMsg = "";
    this.walletList = [];

    this.pending = function(mode) {
    	ctrl.isPending = mode;
    }

    this.showNotify = function(msg) {
    	ctrl.notifyMsg = msg;
    	ctrl.isNotify = true;
    }

    this.loadData = function() {
    	console.log('walletCtrl.loadData()');
    	ctrl.pending(true);

    	var reqUrl = serverService.addr + "/walletInfos?token=" + authService.getUserInfo().token;
    	$http.get(reqUrl).success(function(data) {
    		console.log(data);

    		if (data.result) {
    			ctrl.walletList = data.result;
    			ctrl.pending(false);
    		}

    		if (data.error) {
    			ctrl.showNotify('Không tải được danh sách ví');
    			ctrl.pending(false);
    		}
    	}).error(function(err) {
    		ctrl.showNotify('Có lỗi xảy ra');
    		ctrl.pending(false);
    	});
    }

    this.init = function() {
    	ctrl.loadData();
    }

    this.init();

    this.goWalletDetail = function(id) {
    	walletService.setWallet(ctrl.walletList[id]);
    	$state.go('walletDetail');
    }

    this.newWallet = function() {
    	walletService.setWallet({});
    	$state.go('walletDetail');
    }

}]);