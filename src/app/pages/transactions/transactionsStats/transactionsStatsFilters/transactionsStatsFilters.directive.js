(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.stats')
        .directive('transactionsStatsFilters', transactionsStatsFilters);

    /** @ngInject */
    function transactionsStatsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/transactions/transactionsStats/transactionsStatsFilters/transactionsStatsFilters.html'
        };
    }
})();