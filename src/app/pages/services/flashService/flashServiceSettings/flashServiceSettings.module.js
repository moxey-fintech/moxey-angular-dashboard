(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.flashService.flashServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('flashServiceSettings', {
                url: '/extensions/flash/settings',
                templateUrl: 'app/pages/services/flashService/flashServiceSettings/flashServiceSettings.html',
                controller: "FlashServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
