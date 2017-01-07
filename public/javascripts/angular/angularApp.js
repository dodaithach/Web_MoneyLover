'use strict';
var app = angular.module('moneyApp', ['ngMaterial', 'ui.router'])
.config(function($mdThemingProvider) {
    var customTeal = $mdThemingProvider.extendPalette('red', {
        '400': '1b7e7d'
    });

    $mdThemingProvider.definePalette('customTeal', customTeal);

    $mdThemingProvider.theme('default')
    .primaryPalette('customTeal', {
        'default': '400'
    })
    .accentPalette('orange');
});

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('home', {
            url : '/home',
            templateUrl : '/uiview/home.html',
            controller : 'LoginCtrl as loginCtrl',
        })
        .state('main', {
            url : '/main',
            templateUrl : '/uiview/main.html',
            controller : 'MainCtrl as mainCtrl',
        })
        .state('statistic', {
            url : '/statistic',
            templateUrl : '/uiview/statistic.html',
            controller : 'StatisticCtrl as statisticCtrl',
        })
        .state('util', {
            url : '/util',
            templateUrl : '/uiview/util.html',
            controller : 'UtilCtrl as utilCtrl',
        })
        .state('transaction', {
            url : '/transaction',
            templateUrl : '/uiview/transaction.html',
            controller : 'TransactionCtrl as transactionCtrl',
        })
        .state('wallet', {
            url : '/wallet',
            templateUrl : '/uiview/wallet.html',
            controller : 'WalletCtrl as walletCtrl',
        })
        .state('walletDetail', {
            url : '/walletDetail',
            templateUrl : '/uiview/walletDetail.html',
            controller : 'WalletDetailCtrl as walletDetailCtrl',
        })

        $urlRouterProvider.otherwise('home');
}]);
