(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionSettings')
        .directive('currencyConversionDisplayCurrency', currencyConversionDisplayCurrency);

    /** @ngInject */
    function currencyConversionDisplayCurrency() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/currencyConversionService/currencyConversionSettings/' +
            'currencyConversionDisplayCurrency/currencyConversionDisplayCurrency.html'
        };
    }
})();
