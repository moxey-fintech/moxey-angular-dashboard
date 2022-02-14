(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceUsers')
        .directive('bitcoinServiceUsersFilters', bitcoinServiceUsersFilters);

    /** @ngInject */
    function bitcoinServiceUsersFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceUsers/bitcoinServiceUsersFilters/bitcoinServiceUsersFilters.html'
        };
    }
})();
