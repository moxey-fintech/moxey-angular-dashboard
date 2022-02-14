(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.userAccList')
        .directive('columnsFilters', columnsFilters);

    /** @ngInject */
    function columnsFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/accounts/accountsList/columnsFilters/columnsFilters.html'
        };
    }
})();