(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceTransactions', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarTestnetServiceTransactions', {
                // url: '/services/stellar-testnet/transactions',
                url: '/extensions/stellar-testnet/transactions',
                templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceTransactions/stellarTestnetServiceTransactions.html',
                controller: "StellarTestnetServiceTransactionsCtrl",
                title: 'Transactions'
            });
    }

})();
