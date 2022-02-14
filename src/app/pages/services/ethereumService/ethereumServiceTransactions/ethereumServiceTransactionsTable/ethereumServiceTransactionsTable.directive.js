(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceTransactions')
        .directive('ethereumServiceTransactionsTable', ethereumServiceTransactionsTable);

    /** @ngInject */
    function ethereumServiceTransactionsTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceTransactions/ethereumServiceTransactionsTable/ethereumServiceTransactionsTable.html'
        };
    }
})();
