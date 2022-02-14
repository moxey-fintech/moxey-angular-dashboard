(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceConfig', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarServiceConfig', {
                // url: '/services/stellar/configuration',
                url: '/extensions/stellar/configuration',
                templateUrl: 'app/pages/services/stellarService/stellarServiceConfig/stellarServiceConfig.html',
                controller: "StellarServiceConfigCtrl",
                title: 'Stellar configuration'
            });
    }

})();
