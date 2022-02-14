(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .directive('creditDeposit', creditDeposit);

    /** @ngInject */
    function creditDeposit() {
        return {
            restrict: 'E',
            controller: 'CreditDepositCtrl',
            templateUrl: 'app/pages/transactions/history/makeTransactionModal/creditDeposit/creditDeposit.html'
        };
    }
})();