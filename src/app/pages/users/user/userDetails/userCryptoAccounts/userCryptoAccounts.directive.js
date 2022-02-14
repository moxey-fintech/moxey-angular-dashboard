(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userCryptoAccounts', userCryptoAccounts);

    /** @ngInject */
    function userCryptoAccounts() {
        return {
            restrict: 'E',
            controller: 'UserCryptoAccountsCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userCryptoAccounts/userCryptoAccounts.html'
        };
    }
})();
