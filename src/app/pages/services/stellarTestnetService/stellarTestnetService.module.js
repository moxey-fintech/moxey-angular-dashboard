(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService', [
        "BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceTransactions",
        "BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceUsers",
        "BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceSetup",
        "BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig",
        "BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts",
        "BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAssets",
        'BlurAdmin.pages.services.stellarTestnetService.stellarTestnetSettings'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarTestnetService', {
                // url: '/services/stellar-testnet',
                url: '/extensions/stellar-testnet',
                abstract:true,
                // templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetService.html',
                // controller: "StellarTestnetServiceCtrl",
                // title: 'Stellar Testnet service'
                title: 'Stellar Testnet extension'
            });
        // $urlRouterProvider.when("/services/stellar-testnet", "/services/stellar-testnet/setup");
        $urlRouterProvider.when("/extensions/stellar-testnet", "/extensions/stellar-testnet/setup");
    }

})();
