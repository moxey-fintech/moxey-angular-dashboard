(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('appServiceSettings', {
                url: '/extensions/app/settings',
                templateUrl: 'app/pages/services/appService/appServiceSettings/appServiceSettings.html',
                controller: "AppServiceSettingsCtrl",
                title: 'Settings'
            });
    }
})();