(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('chiplessCardServiceSettings', {
                url: '/extensions/chipless-card/settings',
                templateUrl: 'app/pages/services/chiplessCardService/chiplessCardServiceSettings/chiplessCardServiceSettings.html',
                controller: "ChiplessCardServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
