(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreTestnetService', [ 
        "BlurAdmin.pages.services.wyreTestnetService.wyreTestnetServiceSettings"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('wyreTestnetService', {
                url: '/extensions/wyre-testnet',
                abstract:true,
                title: 'Wyre Testnet Extension'
            });

        $urlRouterProvider.when("/extensions/wyre-testnet", "/extensions/wyre-testnet/settings");
    }

})();
