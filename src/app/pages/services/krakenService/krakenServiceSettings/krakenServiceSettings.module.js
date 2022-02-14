(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.krakenService.krakenServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('krakenServiceSettings', {
                url: '/extensions/kraken/settings',
                templateUrl: 'app/pages/services/krakenService/krakenServiceSettings/krakenServiceSettings.html',
                controller: "KrakenServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
