(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionSettings')
        .directive('currencyConversionDeactivation', currencyConversionDeactivation);

    /** @ngInject */
    function currencyConversionDeactivation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/currencyConversionService/currencyConversionSettings/' +
            'currencyConversionDeactivation/currencyConversionDeactivation.html'
        };
    }
})();
