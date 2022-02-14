(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarServiceAccounts', {
                // url: '/services/stellar/accounts',
                url: '/extensions/stellar/accounts',
                templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarServiceAccounts.html',
                controller: "StellarServiceAccountsCtrl",
                title: 'Accounts'
            });
    }

})();
