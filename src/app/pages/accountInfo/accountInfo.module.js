(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountInfo', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('accountInfo', {
                url: '/account-info',
                templateUrl: 'app/pages/accountInfo/accountInfo.html',
                controller: "AccountInfoCtrl",
                title: "Account info"
            });
    }

})();
