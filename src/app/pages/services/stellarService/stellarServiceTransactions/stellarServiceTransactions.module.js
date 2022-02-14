(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceTransactions', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarServiceTransactions', {
                // url: '/services/stellar/transactions',
                url: '/extensions/stellar/transactions',
                templateUrl: 'app/pages/services/stellarService/stellarServiceTransactions/stellarServiceTransactions.html',
                controller: "StellarServiceTransactionsCtrl",
                title: 'Transactions'
            });
    }

})();
