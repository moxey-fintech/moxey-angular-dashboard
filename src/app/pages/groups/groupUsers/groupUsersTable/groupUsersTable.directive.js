(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers')
        .directive('groupUsersTable', groupUsersTable);

    /** @ngInject */
    function groupUsersTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/groups/groupUsers/groupUsersTable/groupUsersTable.html'
        };
    }
})();