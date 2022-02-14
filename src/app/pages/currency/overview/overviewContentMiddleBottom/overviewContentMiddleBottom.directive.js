(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency.overview')
        .directive('overviewContentMiddleBottom', overviewContentMiddleBottom);

    /** @ngInject */
    function overviewContentMiddleBottom() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/currency/overview/overviewContentMiddleBottom/overviewContentMiddleBottom.html'
        };
    }
})();