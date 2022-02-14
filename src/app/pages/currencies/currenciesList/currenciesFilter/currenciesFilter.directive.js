(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies.currenciesList')
        .directive('currenciesFilter', currenciesFilter);

    /** @ngInject */
    function currenciesFilter() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/currencies/currenciesList/currenciesFilter/currenciesFilter.html'
        };
    }
})();