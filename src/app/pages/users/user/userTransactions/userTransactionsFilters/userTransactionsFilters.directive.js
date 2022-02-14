(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.transactions')
        .directive('userTransactionsFilters', userTransactionsFilters);

    /** @ngInject */
    function userTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userTransactions/userTransactionsFilters/userTransactionsFilters.html'
        };
    }
})();
