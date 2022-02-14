(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceAccounts')
        .directive('bitcoinTestnetServiceAccountsMenu', bitcoinTestnetServiceAccountsMenu);

    /** @ngInject */
    function bitcoinTestnetServiceAccountsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceAccounts/bitcoinTestnetserviceAccountsMenu/bitcoinTestnetserviceAccountsMenu.html'
        };
    }
})();
