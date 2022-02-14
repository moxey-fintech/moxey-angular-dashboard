(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .directive('transferDeposit', transferDeposit);

    /** @ngInject */
    function transferDeposit() {
        return {
            restrict: 'E',
            controller: 'TransferDepositCtrl',
            templateUrl: 'app/pages/transactions/history/makeTransactionModal/transferDeposit/transferDeposit.html'
        };
    }
})();