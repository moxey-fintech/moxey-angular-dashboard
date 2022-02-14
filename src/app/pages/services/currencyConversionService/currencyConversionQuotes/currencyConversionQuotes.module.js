(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('currencyConversionService.currencyConversionQuotes', {
                url: '/quotes',
                views: {
                    'currencyConversionServiceViews' : {
                        templateUrl:'app/pages/services/currencyConversionService/currencyConversionQuotes/currencyConversionQuotes.html',
                        controller: "CurrencyConversionQuotesCtrl"
                    }
                },
                title: 'Quotes'
            });
    }

})();
