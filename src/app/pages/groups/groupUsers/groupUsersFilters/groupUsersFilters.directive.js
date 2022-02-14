(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers')
        .directive('groupUsersFilters', groupUsersFilters);

    /** @ngInject */
    function groupUsersFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/groups/groupUsers/groupUsersFilters/groupUsersFilters.html'
        };
    }
})();