(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.logs')
        .directive('userLogsFilters', userLogsFilters);

    /** @ngInject */
    function userLogsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userLogs/userLogsFilters/userLogsFilters.html'
        };
    }
})();