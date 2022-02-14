(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionCurrencies', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('currencyConversionService.currencyConversionCurrencies', {
                url: '/currencies',
                views: {
                    'currencyConversionServiceViews' : {
                        templateUrl:'app/pages/services/currencyConversionService/currencyConversionCurrencies/currencyConversionCurrencies.html',
                        controller: "CurrencyConversionCurrenciesCtrl"
                    }
                },
                title: 'Currencies'
            });
    }

})();
