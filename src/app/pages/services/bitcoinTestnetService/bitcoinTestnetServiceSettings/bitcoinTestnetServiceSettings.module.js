(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('bitcoinTestnetServiceSettings', {
                // url: '/services/bitcoin/settings',
                url: '/extensions/bitcoin-testnet/settings',
                templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceSettings/bitcoinTestnetServiceSettings.html',
                controller: "BitcoinTestnetServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
