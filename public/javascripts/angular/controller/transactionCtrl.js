'use strict';
angular.module('moneyApp')
.controller('TransactionCtrl', ['$http', '$state', 'authService', 'serverService', 'timeService', 'transactionService', 
								function($http, $state, authService, serverService, timeService, transactionService) {
    var ctrl = this;

    if (!authService.isLoggedIn()) {
    	$state.go('home');
    }

    this.isShowDelBtn = true;

    this.isNotify = false;
    this.notifyMsg = "";

    this.isMiniNotify = false;
    this.miniNotifyMsg = "";
    
    this.showMiniNotify = function(msg) {
        ctrl.isMiniNotify = true;
        ctrl.miniNotifyMsg = msg;
    }

    this.showNotify = function(code, msg) {
        ctrl.isNotify = code;
        ctrl.notifyMsg = msg;
    }

    this.isPending = false;

    this.categoryList = [];
    this.walletList = [];
    this.date = null;
    this.transaction = {};

    this.reset = function() {
    	console.log('transactoinCtrl.reset()');
    	ctrl.categoryList = [];
    	ctrl.transaction = {};
    	ctrl.date = null;
    }

    this.pending = function(mode) {
    	ctrl.isPending = mode;
    }

    this.emptyTransaction = function() {
    	console.log('transactoinCtrl.emptyTransaction()');
    	console.log(ctrl.transaction);

        ctrl.transaction._id = "";
        ctrl.transaction.category_id = "";
        ctrl.transaction.for_date = null;
        ctrl.transaction.location = "";
        ctrl.transaction.note = "";
        ctrl.transaction.price = "";
        ctrl.transaction.wallet_id = "";
    }

    this.loadData = function() {
    	console.log('transactionCtrl.loadData()');
    	ctrl.pending(true);

    	var categoryUrl = serverService.addr + "/categories";
    	$http.get(categoryUrl).success(function(data) {
    		if (data.result) {
    			for (var i = 0; i < data.result.length; i++) {
    				ctrl.categoryList.push(data.result[i]);
    			}

	            var reqUrl = serverService.addr + "/walletInfos?token=" + authService.getUserInfo().token;
	            $http.get(reqUrl).success(function(data) {
	                if (data.result) {
	                    authService.setWalletList(data.result);
	                    ctrl.walletList = authService.getWalletList();

	                    var transaction = transactionService.getTransaction();
		                if (transaction) {
		                    ctrl.transaction = transaction;
		                    console.log(ctrl.transaction._id);
		                    if (ctrl.transaction._id != "undefined") {
		                        if (typeof(transaction.for_date) == 'string') {
		                            var parsed = parseInt(transaction.for_date);
		                            ctrl.date = new Date(parsed * 1000);
		                        }
		                        else {
		                            ctrl.date = new Date(ctrl.transaction.for_date * 1000);
		                        }
		                    }
		                    else {
		                    	ctrl.isShowDelBtn = false;
		                        ctrl.emptyTransaction();
		                    }
		                }

		                ctrl.pending(false);
	                }

	                if (data.error) {
                        console.log(data);
	                	ctrl.showNotify(1, 'Khong tai duoc du lieu');
		    			ctrl.pending(false);
	                }
	            }).error(function(err) {
	            	ctrl.showNotify(1, 'Co loi xay ra');
	    			ctrl.pending(false);
	            });
    		}

    		if (data.error) {
                console.log(data);
    			ctrl.showNotify(1, 'Khong tai duoc du lieu');
    			ctrl.pending(false);
    		}
    	}).error(function(err) {
    		ctrl.showNotify(1, 'Co loi xay ra');
			ctrl.pending(false);
    	});
    }

    this.init = function() {
    	console.log('transactionCtrl.init()');
    	ctrl.reset();
    	ctrl.loadData();
    }

    this.init();

    this.checkInput = function() {
        if (!ctrl.date || !ctrl.transaction.price || !ctrl.transaction.category_id
            || !ctrl.transaction.location || !ctrl.transaction.note || !ctrl.transaction.wallet_id
            || ctrl.date == null || ctrl.transaction.price == "" || ctrl.transaction.category_id == ""
            || ctrl.transaction.location == "" || ctrl.transaction.note == ""
            || ctrl.transaction.wallet_id == "") {
            return false;
        }

        return true;
    }

    this.cancel = function() {
        $state.go('main');
    }

    this.delete = function() {
        ctrl.pending(true);
        var reqUrl = serverService.addr + "/transactions/" + ctrl.transaction._id
                        + "?wallet_id=" + ctrl.transaction.wallet_id + "&token=" + authService.getUserInfo().token;
        $http.delete(reqUrl).success(function(data) {
        	if (data.error) {
                console.log(data);
				ctrl.showNotify(1, 'Xoa khong thanh cong');
	            ctrl.pending(false);        		
        	}
        	else {
        		ctrl.showNotify(2, 'Xoa thanh cong');
	            ctrl.pending(false);
        	}
        }).error(function(err) {
        	ctrl.showNotify(1, 'Co loi xay ra');
        	ctrl.pending(false);
        });
    }

    this.save = function() {
        if (!ctrl.checkInput()) {
            ctrl.showMiniNotify('Vui long dien day du thong tin');
            return;
        }

        ctrl.isMiniNotify = false;
        ctrl.pending(true);

        ctrl.transaction.for_date = timeService.getDateInSecond(ctrl.date);
        var reqUrl;
        if (ctrl.transaction._id == "") {
            reqUrl = serverService.addr + "/transactions/?wallet_id=" + ctrl.transaction.wallet_id 
                        + "&token=" + authService.getUserInfo().token;

            ctrl.transaction.create_date = timeService.getDateInSecond(new Date());
            ctrl.transaction.user_id = authService.getUserInfo()._id;
            delete ctrl.transaction._id;

            console.log(ctrl.transaction);
	        $http.post(reqUrl, ctrl.transaction).success(function(data) {
	            if (data.error) {
                    console.log(data);
	            	ctrl.pending(false);
		            ctrl.showNotify(1, 'Tao giao dich khong thanh cong');	
	            }
	            else {
		            ctrl.pending(false);
		            ctrl.showNotify(2, 'Tao giao dich thanh cong');
		        }
	        }).error(function(err) {
	            ctrl.pending(false);
	            ctrl.showNotify(1, 'Co loi xay ra');
	        });
        }
        else {
        	console.log(ctrl.transaction);
            reqUrl = serverService.addr + "/transactions/" + ctrl.transaction._id + "?wallet_id=" + ctrl.transaction.wallet_id + "&token=" + authService.getUserInfo().token; 
            $http.put(reqUrl, ctrl.transaction).success(function(data) {
            	if (data.error) {
                    console.log(data);
            		ctrl.pending(false);
	            	ctrl.showNotify(1, 'Cap nhat khong thanh cong');	
            	}
            	else {
            		ctrl.pending(false);
	            	ctrl.showNotify(2, 'Cap nhat thanh cong');
            	}
            }).error(function(err) {
            	ctrl.pending(false);
            	ctrl.showNotify(1, 'Co loi xay ra');
            });
        }
    }
}]);