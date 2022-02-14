(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('bitcoinServiceAccounts', {
                // url: '/services/bitcoin/accounts',
                url: '/extensions/bitcoin/accounts',
                templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinServiceAccounts.html',
                controller: "BitcoinServiceAccountsCtrl",
                title: 'Accounts',
                param: {
                    view: null
                }
            });
    }

})();
