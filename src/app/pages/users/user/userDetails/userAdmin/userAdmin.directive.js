(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userAdmin', userAdmin);

    /** @ngInject */
    function userAdmin() {
        return {
            restrict: 'E',
            controller: 'UserAdminCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userAdmin/userAdmin.html'
        };
    }
})();
