
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userAuth', userAuth);

    /** @ngInject */
    function userAuth() {
        return {
            restrict: 'E',
            controller: 'UserAuthCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userAuth/userAuth.html'
        };
    }
})();
