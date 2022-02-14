(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceTransactions', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('ethereumServiceTransactions', {
                // url: '/services/ethereum/transactions',
                url: '/extensions/ethereum/transactions',
                templateUrl: 'app/pages/services/ethereumService/ethereumServiceTransactions/ethereumServiceTransactions.html',
                controller: "EthereumServiceTransactionsCtrl",
                title: 'Transactions'
            });
    }

})();
