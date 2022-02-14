(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAssets', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarServiceAssets', {
                // url: '/services/stellar/assets',
                url: '/extensions/stellar/assets',
                templateUrl: 'app/pages/services/stellarService/stellarServiceAssets/stellarServiceAssets.html',
                controller: "StellarServiceAssetsCtrl",
                title: 'Assets'
            });
    }

})();
