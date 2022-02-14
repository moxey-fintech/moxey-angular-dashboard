(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceTransactions', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('bitcoinServiceTransactions', {
                // url: '/services/bitcoin/transactions',
                url: '/extensions/bitcoin/transactions',
                templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceTransactions/bitcoinServiceTransactions.html',
                controller: "BitcoinServiceTransactionsCtrl",
                title: 'Transactions'
            });
    }

})();
