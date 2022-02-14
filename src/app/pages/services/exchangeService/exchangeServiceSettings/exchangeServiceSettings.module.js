(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.exchangeServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('exchangeService.exchangeServiceSettings', {
                url: '/settings',
                views: {
                  'exchangeServiceViews' : {
                    templateUrl:'app/pages/services/exchangeService/exchangeServiceSettings/exchangeServiceSettings.html',
                    controller: "ExchangeServiceSettingsCtrl"
                  }
                },
                title: 'Settings'
            });
    }

})();
