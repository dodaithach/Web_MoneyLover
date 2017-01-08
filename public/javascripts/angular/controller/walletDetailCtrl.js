'use strict';
angular.module('moneyApp')
.controller('WalletDetailCtrl', ['$http', '$state', 'authService', 'walletService', 'serverService',
								 function($http, $state, authService, walletService, serverService) {
	var ctrl = this;

	this.isPending = false;
	
	this.pending = function(mode) {
		ctrl.isPending = mode;
	}

	this.isShowDelBtn = true;

	this.isNotify = 0;
	this.notifyMsg = "";

	this.showNotify = function(mode, msg) {
		ctrl.isNotify = mode;
		ctrl.notifyMsg = msg;
	}

	this.isMiniNotify = false;
	this.miniNotifyMsg = "";

	this.showMiniNotify = function(msg) {
		ctrl.isMiniNotify = true;
		ctrl.miniNotifyMsg = msg;
	}

	this.wallet = {};
	this.user = {};
	this.user_avatar = "/img/ic_user.png";

	this.emptyWallet = function() {
		ctrl.wallet._id = "";
		ctrl.wallet.money = 0;
		ctrl.wallet.name = "";
	}

	this.loadData = function() {
		ctrl.user = authService.getUserInfo();
		if (ctrl.user.avatar != 'undefined' && ctrl.user.avatar != '') {
			ctrl.user_avatar = ctrl.user.avatar;
		}

		ctrl.wallet = walletService.getWallet();
		if (ctrl.wallet._id == 'undefined' || ctrl.wallet._id == "") {
			ctrl.emptyWallet();
			ctrl.isShowDelBtn = false;
		}
	}

	this.init = function() {
		ctrl.loadData();
	}

	this.init();

	this.checkInput = function() {
		console.log(ctrl.wallet);
		if (!ctrl.wallet.name || !ctrl.wallet.money || ctrl.wallet.name == "" || ctrl.wallet.money == "") {
			return false;
		}

		return true;
	}

	this.cancel = function() {
		$state.go('wallet');
	}

	this.delete = function() {
		var reqUrl = serverService.addr + "/walletInfos/" + ctrl.wallet._id + "?token=" + ctrl.user.token;
		$http.delete(reqUrl).success(function(data) {
			if (data.error) {
				console.log(data);
				ctrl.showNotify(1, 'Xóa ví không thành công');
			}
			else {
				ctrl.showNotify(2, 'Xóa ví thành công');
			}

			ctrl.pending(false);
		}).error(function(err) {
			ctrl.showNotify(1, 'Có lỗi xảy ra');
			ctrl.pending(false);
		});
	}

	this.save = function() {
		console.log('walletDetailCtrl.save()');
		ctrl.pending(true);

		if (!ctrl.checkInput()) {
			ctrl.showMiniNotify('Vui lòng điền đày đủ thông tin');
			ctrl.pending(false);
			return;
		}

		var params = {
			'user_id': ctrl.user._id,
			'name': ctrl.wallet.name,
			'money': ctrl.wallet.money
		};

		if (ctrl.wallet._id == 'undefined' || ctrl.wallet._id == '') {
			var reqUrl = serverService.addr + "/walletInfos?token=" + ctrl.user.token;
			$http.post(reqUrl, params).success(function(data) {
				if (data.error) {
					console.log(data);
					ctrl.showNotify(1, 'Tạo ví không thành công');
				}
				else {
					ctrl.showNotify(2, 'Tạo ví thành công');
				}

				ctrl.pending(false);
			}).error(function(err) {
				ctrl.showNotify(1, 'Có lỗi xảy ra');
				ctrl.pending(false);
			});	
		}
		else {
			var reqUrl = serverService.addr + "/walletInfos/" + ctrl.wallet._id + "?token=" + ctrl.user.token;
			$http.put(reqUrl, params).success(function(data) {
				if (data.error) {
					console.log(data);
					ctrl.showNotify(1, 'Cập nhật ví không thành công');
				}
				else {
					ctrl.showNotify(2, 'Cập nhật ví thành công');
				}

				ctrl.pending(false);
			}).error(function(err) {
				ctrl.showNotify(1, 'Có lỗi xảy ra');
				ctrl.pending(false);
			});
		}
	}
}]);