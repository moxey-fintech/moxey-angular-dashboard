(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.krakenService', [
        "BlurAdmin.pages.services.krakenService.krakenServiceSettings"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('krakenService', {
                url: '/extensions/kraken',
                abstract:true,
                title: 'Kraken extension'
            });

        $urlRouterProvider.when("/extensions/kraken", "/extensions/kraken/settings");
    }

})();
