(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService', [
        "BlurAdmin.pages.services.appService.appServiceAppConfig",
        "BlurAdmin.pages.services.appService.appServiceJSONConfig",
        "BlurAdmin.pages.services.appService.appServiceSettings",
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('appService', {
                url: '/extensions/app',
                abstract:true,
                title: 'App extension'
            });

        // $urlRouterProvider.when("/extensions/app", "/extensions/app/app-config");
        $urlRouterProvider.when("/extensions/app", "/extensions/app/app-config");
    }

})();
