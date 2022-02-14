(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceTransactions')
        .directive('stellarServiceTransactionsFilter', stellarServiceTransactionsFilter);

    /** @ngInject */
    function stellarServiceTransactionsFilter() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarServiceTransactions/stellarServiceTransactionsFilter/stellarServiceTransactionsFilter.html'
        };
    }
})();
