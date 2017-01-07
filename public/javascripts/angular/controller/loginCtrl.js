'use strict';
angular.module('moneyApp')
.controller('LoginCtrl', ['$http', '$state', '$timeout', 'authService', function($http, $state, $timeout, authService) {
    console.log('loginCtrl loaded');

    var ctrl = this;

    this.notifyMsg = '';
    this.isNotify = false;
    this.user = {};
    this.isBtnClicked = false;
    this.isPending = false;

    this.showNotify = function(msg) {
    	ctrl.notifyMsg = msg;
    	ctrl.isNotify = true;
    	$timeout(function() { ctrl.isNotify = false; ctrl.notifyMsg = ''; }, 2000);
    }

    this.render = function() {
    	gapi.signin2.render('my-signin2', {
            'scope': 'profile email',
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': ctrl.loginSuccess,
            'onfailure': ctrl.loginFail
        });
    }

    this.loginSuccess = function(googleUser) {
    	var profile = googleUser.getBasicProfile();

    	ctrl.user = {
    		'google_id': profile.getId(),
    		'token': googleUser.Zi.id_token,
    		'name': profile.getName(),
    		'avatar': profile.getImageUrl(),
    		'mail': profile.getEmail()
    	};

        if (ctrl.isBtnClicked) {
            ctrl.isBtnClicked = false;
            authService.logIn(ctrl.user).success(function(data) {
                authService.saveUserInfo(data.result);

                ctrl.isPending = false;
                $state.go('main');
            }).error(function(err) {
                ctrl.showNotify('Dang nhap khong thanh cong');
                ctrl.isPending = false;
            });
        }
    }

    this.loginFail = function(err) {
    	ctrl.showNotify('Dang nhap khong thanh cong');
    }

    this.logIn = function() {
    	ctrl.isBtnClicked = true;
        ctrl.isPending = true;
    }

    if (authService.isLoggedIn()) {
		$state.go('main');
	}
   	else {
   		this.render();
   	}
}]);
