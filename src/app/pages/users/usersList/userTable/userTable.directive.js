(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.list')
        .directive('userTable', userTable);

    /** @ngInject */
    function userTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/usersList/userTable/userTable.html'
        };
    }
})();