(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService', [ 
        "BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceTerminals", 
        "BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceCards",
        "BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceSettings",
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('chiplessCardService', {
                url: '/extensions/chipless-card',
                abstract:true,
                title: 'Chipless Card extension'
            });

        $urlRouterProvider.when("/extensions/chipless-card", "/extensions/chipless-card/terminals");
    }

})();
