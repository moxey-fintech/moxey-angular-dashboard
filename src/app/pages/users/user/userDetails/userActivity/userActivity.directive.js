(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userActivity', userActivity);

    /** @ngInject */
    function userActivity() {
        return {
            restrict: 'E',
            controller: 'UserActivityCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userActivity/userActivity.html'
        };
    }
})();
