(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .directive('debit', debit);

    /** @ngInject */
    function debit() {
        return {
            restrict: 'E',
            controller: 'DebitCtrl',
            templateUrl: 'app/pages/transactions/history/makeTransactionModal/debit/debit.html'
        };
    }
})();