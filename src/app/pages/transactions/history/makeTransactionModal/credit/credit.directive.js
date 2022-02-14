(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .directive('credit', credit);

    /** @ngInject */
    function credit() {
        return {
            restrict: 'E',
            controller: 'CreditCtrl',
            templateUrl: 'app/pages/transactions/history/makeTransactionModal/credit/credit.html'
        };
    }
})();