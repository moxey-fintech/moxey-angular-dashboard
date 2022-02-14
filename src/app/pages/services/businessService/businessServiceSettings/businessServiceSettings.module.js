(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('businessServiceSettings', {
                url: '/extensions/business/settings',
                templateUrl: 'app/pages/services/businessService/businessServiceSettings/businessServiceSettings.html',
                controller: "BusinessServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
