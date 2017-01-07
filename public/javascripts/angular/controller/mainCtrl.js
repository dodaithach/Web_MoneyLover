'use strict';
angular.module('moneyApp')
.controller('MainCtrl', ['$rootScope', '$http', '$state', '$timeout', 'authService', 'serverService', 'timeService', 'transactionService', 
                            function($rootScope, $http, $state, $timeout, authService, serverService, timeService, transactionService) {
    console.log('mainCtrl loaded');
    var ctrl = this;

    this.isPending = false;
    this.isNotify = false;
    this.notifyMsg = "";

    this.currentDate = null;
    this.beginAmount = 0;
    this.endAmound = 0;
    this.transactionList = [];

    if (!authService.isLoggedIn()) {
    	$state.go('home');
    }

    this.showNotify = function(msg) {
    	ctrl.notifyMsg = msg;
    	ctrl.isNotify = true;
    }

    this.pending = function() {
        ctrl.isPending = true;
        $timeout(function() {ctrl.isPending = false;},3000);
    }

    this.reset = function() {
        console.log('mainCtrl.reset()');
        this.beginAmount = 0;
        this.endAmound = 0;
        this.transactionList = [];
    }

    this.loadData = function(currentDate) {
        console.log('mainCtrl.loadData()');
        ctrl.reset();

        var reqUrl = serverService.addr + "/walletInfos?token=" + authService.getUserInfo().token;
        $http.get(reqUrl).success(function(data) {
            if (data.result) {
                authService.setWalletList(data.result);

                var walletList = authService.getWalletList();
                var date = timeService.getDateInSecond(currentDate);
                for (var i = 0; i < walletList.length; i++) {
                    var subUrl = serverService.addr + "/transactions?date=" + date
                                 + "&wallet_id=" + walletList[i]._id + "&token=" + authService.getUserInfo().token;
                    $http.get(subUrl).success(function(data) {
                        var transactionList = data.result;
                        if (transactionList) {
                            for (var i = 0; i < transactionList.length; i++) {
                                ctrl.transactionList.push(transactionList[i]);
                            }
                        }
                    }).error(function(err) {
                        ctrl.showNotify('Khong the tai duoc du lieu');
                        ctrl.isPending = false;
                    });
                }
            }

            if (data.error) {
                console.log(data);
                ctrl.showNotify('Khong the tai duoc du lieu');
                ctrl.isPending = false;
            }
        }).error(function(err) {
            ctrl.showNotify('Co loi xay ra');
            ctrl.isPending = false;
        });
    }

    this.init = function() {
        console.log('mainCtrl.init()');
        ctrl.pending();
    	ctrl.currentDate = new Date();
        ctrl.loadData(ctrl.currentDate);
    }

    this.init();

    this.dateChange = function() {
        ctrl.pending();
        ctrl.loadData(ctrl.currentDate);
    }

    this.transactionClicked = function(id) {
        transactionService.setTransaction(ctrl.transactionList[id]);
    	$state.go('transaction');
    }

    this.newTransaction = function() {
        transactionService.setTransaction({});
        $state.go('transaction');
    }
}]);