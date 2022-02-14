(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.standaloneAccList')
        .directive('standaloneAccountFilters', standaloneAccountFilters);

    /** @ngInject */
    function standaloneAccountFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/accounts/standaloneAccountsList/standaloneAccountFilters/standaloneAccountFilters.html'
        };
    }
})();