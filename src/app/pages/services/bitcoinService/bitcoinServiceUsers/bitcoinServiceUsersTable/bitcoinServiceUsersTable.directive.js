(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceUsers')
        .directive('bitcoinServiceUsersTable', bitcoinServiceUsersTable);

    /** @ngInject */
    function bitcoinServiceUsersTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceUsers/bitcoinServiceUsersTable/bitcoinServiceUsersTable.html'
        };
    }
})();
