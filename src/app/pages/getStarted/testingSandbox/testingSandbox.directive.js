(function () {
    'use strict';

    angular.module('BlurAdmin.pages.getStarted')
        .directive('testingSandbox', testingSandbox);

    /** @ngInject */
    function testingSandbox() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/getStarted/testingSandbox/testingSandbox.html'
        };
    }
})();