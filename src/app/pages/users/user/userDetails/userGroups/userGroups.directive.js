(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userGroups', userGroups);

    /** @ngInject */
    function userGroups() {
        return {
            restrict: 'E',
            controller: 'UserGroupsCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userGroups/userGroups.html'
        };
    }
})();
