(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.listExchangeServiceQuotes')
        .directive('exchangeFilters', exchangeFilters);

    /** @ngInject */
    function exchangeFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/exchangeService/exchangeServiceQuotes/listExchangeServiceQuotes/exchangeFilters/exchangeFilters.html'
        };
    }
})();