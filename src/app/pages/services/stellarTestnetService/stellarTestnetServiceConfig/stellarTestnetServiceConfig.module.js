(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarTestnetServiceConfig', {
                // url: '/services/stellar-testnet/configuration',
                url: '/extensions/stellar-testnet/configuration',
                templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceConfig/stellarTestnetServiceConfig.html',
                controller: "StellarTestnetServiceConfigCtrl",
                title: 'Stellar testnet configuration'
            });
    }

})();
