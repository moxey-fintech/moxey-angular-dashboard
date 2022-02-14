(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .directive('bitcoinHotwallet', bitcoinHotwallet);

    /** @ngInject */
    function bitcoinHotwallet() {
        return {
            restrict: 'E',
            controller: 'BitcoinHotwalletCtrl',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinHotwallet/bitcoinHotwallet.html'
        };
    }
})();
