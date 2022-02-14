(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes')
        .directive('currencyConversionQuotesFilters', currencyConversionQuotesFilters);

    /** @ngInject */
    function currencyConversionQuotesFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/currencyConversionService/currencyConversionQuotes/currencyConversionQuotesFilters/currencyConversionQuotesFilters.html'
        };
    }
})();
