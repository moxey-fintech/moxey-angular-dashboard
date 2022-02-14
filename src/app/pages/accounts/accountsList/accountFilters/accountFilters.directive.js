(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.userAccList')
        .directive('accountsFilters', accountsFilters);

    /** @ngInject */
    function accountsFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/accounts/accountsList/accountFilters/accountFilters.html'
        };
    }
})();