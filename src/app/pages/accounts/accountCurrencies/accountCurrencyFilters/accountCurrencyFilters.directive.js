(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.currencies')
        .directive('accountCurrencyFilters', accountCurrencyFilters);

    /** @ngInject */
    function accountCurrencyFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/accounts/accountCurrencies/accountCurrencyFilters/accountCurrencyFilters.html'
        };
    }
})();