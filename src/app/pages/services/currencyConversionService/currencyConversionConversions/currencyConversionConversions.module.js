(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionsList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('currencyConversionService.currencyConversionsList', {
                url: '/list',
                views: {
                    'currencyConversionServiceViews' : {
                        templateUrl:'app/pages/services/currencyConversionService/currencyConversionConversions/currencyConversionConversions.html',
                        controller: "CurrencyConversionConversionsCtrl"
                    }
                },
                title: 'Conversion list'
            });
    }

})();
