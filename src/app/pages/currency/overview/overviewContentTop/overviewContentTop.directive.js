(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency.overview')
        .directive('overviewContentTop', overviewContentTop);

    /** @ngInject */
    function overviewContentTop() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/currency/overview/overviewContentTop/overviewContentTop.html'
        };
    }
})();