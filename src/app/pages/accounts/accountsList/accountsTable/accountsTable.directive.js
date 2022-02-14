(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.userAccList')
        .directive('accountsTable', accountsTable);

    /** @ngInject */
    function accountsTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/accounts/accountsList/accountsTable/accountsTable.html'
        };
    }
})();