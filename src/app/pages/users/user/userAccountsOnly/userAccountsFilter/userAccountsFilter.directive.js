(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .directive('userAccountsFilter', userAccountsFilter);

    /** @ngInject */
    function userAccountsFilter() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/user/userAccountsOnly/userAccountsFilter/userAccountsFilter.html'
        };
    }
})();