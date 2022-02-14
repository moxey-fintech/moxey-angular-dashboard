(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService', [
        'BlurAdmin.pages.services.currencyConversionService.currencyConversionRates',
        'BlurAdmin.pages.services.currencyConversionService.currencyConversionPairList',
        'BlurAdmin.pages.services.currencyConversionService.currencyConversionsList',
        'BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes',
        'BlurAdmin.pages.services.currencyConversionService.currencyConversionCurrencies',
        'BlurAdmin.pages.services.currencyConversionService.currencyConversionSettings',
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('currencyConversionService', {
                // url: '/services/conversion',
                url: '/extensions/conversion',
                abstract: true,
                template:'<div ui-view="currencyConversionServiceViews"></div>'
            });
        // $urlRouterProvider.when("/services/conversion", "/services/conversion/rates");
        $urlRouterProvider.when("/extensions/conversion", "/extensions/conversion/rates");
    }

})();
