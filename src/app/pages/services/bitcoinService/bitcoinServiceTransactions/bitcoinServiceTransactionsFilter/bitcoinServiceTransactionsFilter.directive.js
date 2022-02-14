(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceTransactions')
        .directive('bitcoinServiceTransactionsFilter', bitcoinServiceTransactionsFilter);

    /** @ngInject */
    function bitcoinServiceTransactionsFilter() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceTransactions/bitcoinServiceTransactionsFilter/bitcoinServiceTransactionsFilter.html'
        };
    }
})();
