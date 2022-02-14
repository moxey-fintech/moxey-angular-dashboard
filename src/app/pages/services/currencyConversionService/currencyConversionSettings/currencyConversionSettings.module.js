(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('currencyConversionService.currencyConversionSettings', {
                url: '/settings',
                views: {
                    'currencyConversionServiceViews' : {
                        templateUrl: 'app/pages/services/currencyConversionService/currencyConversionSettings/' +
                        'currencyConversionSettings.html',
                        controller: "CurrencyConversionSettingsCtrl"
                    }
                },
                title: 'Settings'
            });
    }

})();
