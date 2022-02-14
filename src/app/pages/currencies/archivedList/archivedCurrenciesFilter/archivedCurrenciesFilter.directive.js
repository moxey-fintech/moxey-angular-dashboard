(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies.archivedList')
        .directive('archivedCurrenciesFilter', archivedCurrenciesFilter);

    /** @ngInject */
    function archivedCurrenciesFilter() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/currencies/archivedList/archivedCurrenciesFilter/archivedCurrenciesFilter.html'
        };
    }
})();