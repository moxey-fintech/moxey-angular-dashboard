(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .directive('transfer', transfer);

    /** @ngInject */
    function transfer() {
        return {
            restrict: 'E',
            controller: 'TransferCtrl',
            templateUrl: 'app/pages/transactions/history/makeTransactionModal/transfer/transfer.html'
        };
    }
})();