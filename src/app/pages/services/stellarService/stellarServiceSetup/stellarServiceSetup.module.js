(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceSetup', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarServiceSetup', {
                // url: '/services/stellar/setup',
                url: '/extensions/stellar/setup',
                templateUrl: 'app/pages/services/stellarService/stellarServiceSetup/stellarServiceSetup.html',
                controller: "StellarServiceSetupCtrl",
                title: 'Account setup'
            });
    }

})();
