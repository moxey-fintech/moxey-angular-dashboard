(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionsList')
        .directive('conversionColumnsFilter', conversionColumnsFilter);

    /** @ngInject */
    function conversionColumnsFilter() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/currencyConversionService/currencyConversionConversions/conversionColumnFIlters/conversionColumnFilters.html'
        };
    }
})();