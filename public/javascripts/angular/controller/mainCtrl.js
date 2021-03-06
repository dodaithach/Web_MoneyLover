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

    this.finalMoney = 0;

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
        ctrl.finalMoney = 0;
        ctrl.beginAmount = 0;
        ctrl.endAmound = 0;
        ctrl.transactionList = [];
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

                                if (transactionList[i].type_id == 0 || transactionList[i].type_id == 2) {
                                    ctrl.finalMoney += transactionList[i].price;
                                }
                                else {
                                    ctrl.finalMoney -= transactionList[i].price;
                                }
                            }
                        }
                    }).error(function(err) {
                        ctrl.showNotify('Không tải được dữ liệu');
                        ctrl.isPending = false;
                    });
                }
            }

            if (data.error) {
                console.log(data);
                ctrl.showNotify('Không tải được dữ liệu');
                ctrl.isPending = false;
            }
        }).error(function(err) {
            ctrl.showNotify('Có lỗi xảy ra');
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
        console.log('mainCtrl.newTransaction()');

        var reqUrl = serverService.addr + "/walletInfos?token=" + authService.getUserInfo().token;
        $http.get(reqUrl).success(function(data) {
            console.log(data);

            if (data.result) {
                console.log(data.result);

                if (data.result.length == 0) {
                    ctrl.showNotify('Vui lòng tạo ví trước khi giao dịch');
                    ctrl.pending(false);

                    return;
                }

                transactionService.setTransaction({});
                $state.go('transaction');
            }

            if (data.error) {
                ctrl.showNotify('Vui lòng tạo ví trước khi giao dịch');
                ctrl.pending(false);
            }
        }).error(function(err) {
            ctrl.showNotify('Có lỗi xảy ra');
            ctrl.pending(false);
        });
    }
}]);