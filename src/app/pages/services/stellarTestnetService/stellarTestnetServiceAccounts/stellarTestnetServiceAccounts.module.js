(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarTestnetServiceAccounts', {
                // url: '/services/stellar-testnet/accounts',
                url: '/extensions/stellar-testnet/accounts',
                templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetServiceAccounts.html',
                controller: "StellarTestnetServiceAccountsCtrl",
                title: 'Accounts'
            });
    }

})();
