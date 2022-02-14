(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.flashService', [
        "BlurAdmin.pages.services.flashService.flashServiceSettings"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('flashService', {
                url: '/extensions/flash',
                abstract:true,
                title: 'Flash extension'
            });

        $urlRouterProvider.when("/extensions/flash", "/extensions/flash/settings");
    }

})();
