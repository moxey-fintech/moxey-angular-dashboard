(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceTransactions')
        .directive('bitcoinServiceTransactionsTable', bitcoinServiceTransactionsTable);

    /** @ngInject */
    function bitcoinServiceTransactionsTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceTransactions/bitcoinServiceTransactionsTable/bitcoinServiceTransactionsTable.html'
        };
    }
})();
