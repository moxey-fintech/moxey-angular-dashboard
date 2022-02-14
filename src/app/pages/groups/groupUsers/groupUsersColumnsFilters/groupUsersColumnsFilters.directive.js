(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers')
        .directive('groupUsersColumnsFilters', groupUsersColumnsFilters);

    /** @ngInject */
    function groupUsersColumnsFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/groups/groupUsers/groupUsersColumnsFilters/groupUsersColumnsFilters.html'
        };
    }
})();