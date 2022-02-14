(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('appServiceAppConfig', {
                url: '/extensions/app/app-config',
                templateUrl: 'app/pages/services/appService/appServiceAppConfig/appServiceAppConfig.html',
                controller: "AppServiceAppConfigCtrl",
                title: "App config",
                params: {
                    showConfig: null
                }
            });
    }

})();