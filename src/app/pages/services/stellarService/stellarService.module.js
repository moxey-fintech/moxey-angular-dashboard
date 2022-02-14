(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService', [
        "BlurAdmin.pages.services.stellarService.stellarServiceTransactions",
        "BlurAdmin.pages.services.stellarService.stellarServiceUsers",
        "BlurAdmin.pages.services.stellarService.stellarServiceSetup",
        "BlurAdmin.pages.services.stellarService.stellarServiceConfig",
        "BlurAdmin.pages.services.stellarService.stellarServiceAccounts",
        "BlurAdmin.pages.services.stellarService.stellarServiceAssets",
        "BlurAdmin.pages.services.stellarService.stellarSettings"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarService', {
                // url: '/services/stellar',
                url: '/extensions/stellar',
                abstract:true,
                // templateUrl: 'app/pages/services/stellarService/stellarService.html',
                // controller: "StellarServiceCtrl",
                // title: 'Stellar service'
                title: 'Stellar extension'
            });
            // $urlRouterProvider.when("/services/stellar", "/services/stellar/setup");
            $urlRouterProvider.when("/extensions/stellar", "/extensions/stellar/setup");
            //"/services/stellar/setup"
    }

})();
