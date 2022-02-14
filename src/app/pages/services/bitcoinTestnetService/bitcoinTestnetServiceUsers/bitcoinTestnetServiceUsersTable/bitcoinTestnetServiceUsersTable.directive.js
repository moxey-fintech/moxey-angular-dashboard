(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceUsers')
        .directive('bitcoinTestnetServiceUsersTable', bitcoinTestnetServiceUsersTable);

    /** @ngInject */
    function bitcoinTestnetServiceUsersTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceUsers/bitcoinTestnetServiceUsersTable/bitcoinTestnetServiceUsersTable.html'
        };
    }
})();
