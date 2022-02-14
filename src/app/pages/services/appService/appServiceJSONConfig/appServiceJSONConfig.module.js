(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceJSONConfig', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('appServiceJSONConfig', {
                url: '/extensions/app/json-config',
                templateUrl: 'app/pages/services/appService/appServiceJSONConfig/appServiceJSONConfig.html',
                controller: "AppServiceJSONConfigCtrl",
                title: 'JSON Config'
            });
    }
})();