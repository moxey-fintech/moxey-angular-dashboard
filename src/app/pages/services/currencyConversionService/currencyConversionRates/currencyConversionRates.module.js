(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('currencyConversionService.currencyConversionRates', {
                url: '/rates',
                views: {
                    'currencyConversionServiceViews' : {
                        templateUrl:'app/pages/services/currencyConversionService/currencyConversionRates/currencyConversionRates.html',
                        controller: "CurrencyConversionRatesCtrl"
                    }
                },
                title: 'Rate pairs'
            });
    }

})();
