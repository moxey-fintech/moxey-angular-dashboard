(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .directive('historyColumnsFilter', historyColumnsFilter);

    /** @ngInject */
    function historyColumnsFilter() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/transactions/history/historyColumnsFilter/historyColumnsFilter.html'
        };
    }
})();