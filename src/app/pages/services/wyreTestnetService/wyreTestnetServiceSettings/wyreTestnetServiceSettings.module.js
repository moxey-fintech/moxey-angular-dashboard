(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreTestnetService.wyreTestnetServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('wyreTestnetServiceSettings', {
                url: '/extensions/wyre-testnet/settings',
                templateUrl: 'app/pages/services/wyreTestnetService/wyreTestnetServiceSettings/wyreTestnetServiceSettings.html',
                controller: "WyreTestnetServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
