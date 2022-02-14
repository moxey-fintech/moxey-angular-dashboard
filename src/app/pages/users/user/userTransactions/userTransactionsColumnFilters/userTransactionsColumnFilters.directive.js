(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.transactions')
        .directive('userTransactionsColumnFilters', userTransactionsColumnFilters);

    /** @ngInject */
    function userTransactionsColumnFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userTransactions/userTransactionsColumnFilters/userTransactionsColumnFilters.html'
        };
    }
})();
