(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.requestLogs')
        .directive('requestLogsFilters', requestLogsFilters);

    /** @ngInject */
    function requestLogsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/developers/requestLogs/requestLogsFilters/requestLogsFilters.html'
        };
    }
})();