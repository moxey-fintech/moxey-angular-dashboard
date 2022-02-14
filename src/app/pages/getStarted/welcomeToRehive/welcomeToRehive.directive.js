(function () {
    'use strict';

    angular.module('BlurAdmin.pages.getStarted')
        .directive('welcomeToRehive', welcomeToRehive);

    /** @ngInject */
    function welcomeToRehive() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/getStarted/welcomeToRehive/welcomeToRehive.html'
        };
    }
})();