(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAssets', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarTestnetServiceAssets', {
                // url: '/services/stellar-testnet/assets',
                url: '/extensions/stellar-testnet/assets',
                templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAssets/stellarTestnetServiceAssets.html',
                controller: "StellarTestnetServiceAssetsCtrl",
                title: 'Assets'
            });
    }

})();
