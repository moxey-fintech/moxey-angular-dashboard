(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceTransactions')
        .directive('stellarTransactionsColumnsFilter', stellarTransactionsColumnsFilter);

    /** @ngInject */
    function stellarTransactionsColumnsFilter() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarServiceTransactions/stellarTransactionsColumnsFilter/stellarTransactionsColumnsFilter.html'
        };
    }
})();
