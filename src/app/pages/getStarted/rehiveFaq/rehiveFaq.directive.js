(function () {
    'use strict';

    angular.module('BlurAdmin.pages.getStarted')
        .directive('rehiveFaq', rehiveFaq);

    /** @ngInject */
    function rehiveFaq() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/getStarted/rehiveFaq/rehiveFaq.html'
        };
    }
})();