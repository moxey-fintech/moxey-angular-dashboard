(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceUsers', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('bitcoinTestnetServiceUsers', {
                // url: '/services/bitcoin/users',
                url: '/extensions/bitcoin-testnet/users',
                templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceUsers/bitcoinTestnetServiceUsers.html',
                controller: "BitcoinTestnetServiceUsersCtrl",
                title: 'Users'
            });
    }

})();
