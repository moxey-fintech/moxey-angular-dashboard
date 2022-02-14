(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarTestnetSettings', {
                // url: '/services/stellar-testnet/settings',
                url: '/extensions/stellar-testnet/settings',
                templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetSettings/stellarTestnetSettings.html',
                controller: "StellarTestnetSettingsCtrl",
                title: 'Settings'
            });
    }

})();
