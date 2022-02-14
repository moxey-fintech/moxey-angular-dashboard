(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceTransactions')
        .directive('ethereumServiceTransactionsFilter', ethereumServiceTransactionsFilter);

    /** @ngInject */
    function ethereumServiceTransactionsFilter() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceTransactions/ethereumServiceTransactionsFilter/ethereumServiceTransactionsFilter.html'
        };
    }
})();
