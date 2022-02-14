(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceUsers')
        .directive('bitcoinTestnetServiceUsersFilters', bitcoinTestnetServiceUsersFilters);

    /** @ngInject */
    function bitcoinTestnetServiceUsersFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceUsers/bitcoinTestnetServiceUsersFilters/bitcoinTestnetServiceUsersFilters.html'
        };
    }
})();
