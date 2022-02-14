(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceTransactions')
        .directive('stellarServiceTransactionsTable', stellarServiceTransactionsTable);

    /** @ngInject */
    function stellarServiceTransactionsTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarServiceTransactions/stellarServiceTransactionsTable/stellarServiceTransactionsTable.html'
        };
    }
})();
