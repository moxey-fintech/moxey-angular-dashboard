(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userBankAccount', userBankAccount);

    /** @ngInject */
    function userBankAccount() {
        return {
            restrict: 'E',
            controller: 'UserBankAccountsCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userBankAccounts/userBankAccounts.html'
        };
    }
})();
