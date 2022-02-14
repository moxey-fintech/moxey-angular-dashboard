(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .directive('transactionNavigation', transactionNavigation);

    /** @ngInject */
    function transactionNavigation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/transactions/transactionNavigation/transactionNavigation.html'
        };
    }
})();