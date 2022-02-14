(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceSetup', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarTestnetServiceSetup', {
                // url: '/services/stellar-testnet/setup',
                url: '/extensions/stellar-testnet/setup',
                templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceSetup/stellarTestnetServiceSetup.html',
                controller: "StellarTestnetServiceSetupCtrl",
                title: 'Account setup'
            });
    }

})();
