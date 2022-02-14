(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarSettings', {
                // url: '/services/stellar/settings',
                url: '/extensions/stellar/settings',
                templateUrl: 'app/pages/services/stellarService/stellarSettings/stellarSettings.html',
                controller: "StellarSettingsCtrl",
                title: 'Settings'
            });
    }

})();
