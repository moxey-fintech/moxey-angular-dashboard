(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.transactions')
        .directive('userTransactionsTable', userTransactionsTable);

    /** @ngInject */
    function userTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userTransactions/userTransactionsTable/userTransactionsTable.html'
        };
    }
})();
