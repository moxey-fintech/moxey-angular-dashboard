(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userEmails', userEmails);

    /** @ngInject */
    function userEmails() {
        return {
            restrict: 'E',
            controller: 'UserEmailsCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userEmails/userEmails.html'
        };
    }
})();
