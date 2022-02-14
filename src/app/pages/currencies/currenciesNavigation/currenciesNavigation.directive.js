(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies')
        .directive('currenciesNavigation', currenciesNavigation);

    /** @ngInject */
    function currenciesNavigation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/currencies/currenciesNavigation/currenciesNavigation.html'
        };
    }
})();