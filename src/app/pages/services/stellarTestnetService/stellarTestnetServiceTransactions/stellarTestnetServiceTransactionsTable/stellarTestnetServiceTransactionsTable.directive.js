(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceTransactions')
        .directive('stellarTestnetServiceTransactionsTable', stellarTestnetServiceTransactionsTable);

    /** @ngInject */
    function stellarTestnetServiceTransactionsTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceTransactions/stellarTestnetServiceTransactionsTable/stellarTestnetServiceTransactionsTable.html'
        };
    }
})();
