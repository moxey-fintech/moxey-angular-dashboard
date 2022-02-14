(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.requestLogs')
        .directive('requestColumnsFilter', requestColumnsFilter);

    /** @ngInject */
    function requestColumnsFilter() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/developers/requestLogs/requestColumnsFilter/requestColumnsFilter.html'
        };
    }
})();