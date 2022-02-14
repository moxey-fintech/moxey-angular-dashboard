(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceTransactions')
        .directive('stellarTestnetServiceTransactionsFilter', stellarTestnetServiceTransactionsFilter);

    /** @ngInject */
    function stellarTestnetServiceTransactionsFilter() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceTransactions/stellarTestnetServiceTransactionsFilter/stellarTestnetServiceTransactionsFilter.html'
        };
    }
})();
