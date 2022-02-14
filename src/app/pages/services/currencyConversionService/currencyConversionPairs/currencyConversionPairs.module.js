(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionPairList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('currencyConversionService.currencyConversionPairList', {
                url: '/pairs',
                views: {
                    'currencyConversionServiceViews' : {
                        templateUrl:'app/pages/services/currencyConversionService/currencyConversionPairs/currencyConversionPairs.html',
                        controller: "CurrencyConversionPairsCtrl"
                    }
                },
                title: 'Conversions list'
            });
    }

})();
