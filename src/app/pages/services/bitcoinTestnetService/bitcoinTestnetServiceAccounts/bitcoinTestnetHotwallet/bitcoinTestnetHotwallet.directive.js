(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceAccounts')
        .directive('bitcoinTestnetHotwallet', bitcoinTestnetHotwallet);

    /** @ngInject */
    function bitcoinTestnetHotwallet() {
        return {
            restrict: 'E',
            controller: 'BitcoinTestnetHotwalletCtrl',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceAccounts/bitcoinTestnetHotwallet/bitcoinTestnetHotwallet.html'
        };
    }
})();
