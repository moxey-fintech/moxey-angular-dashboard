(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('ethereumServiceSettings', {
                // url: '/services/ethereum/settings',
                url: '/extensions/ethereum/settings',
                templateUrl: 'app/pages/services/ethereumService/ethereumServiceSettings/ethereumServiceSettings.html',
                controller: "EthereumServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
