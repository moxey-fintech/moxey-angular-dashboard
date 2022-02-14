(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userNumbers', userNumbers);

    /** @ngInject */
    function userNumbers() {
        return {
            restrict: 'E',
            controller: 'UserNumbersCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userNumbers/userNumbers.html'
        };
    }
})();
