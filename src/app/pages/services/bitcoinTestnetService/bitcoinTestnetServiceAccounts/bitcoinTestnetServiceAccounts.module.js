(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceAccounts', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('bitcoinTestnetServiceAccounts', {
                // url: '/services/bitcoin/accounts',
                url: '/extensions/bitcoin-testnet/accounts',
                templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceAccounts/bitcoinTestnetServiceAccounts.html',
                controller: "BitcoinTestnetServiceAccountsCtrl",
                title: 'Accounts',
                param: {
                    view: null
                }
            });
    }

})();
