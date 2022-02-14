(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceAccounts')
        .directive('bitcoinTestnetColdstorage', bitcoinTestnetColdstorage);

    /** @ngInject */
    function bitcoinTestnetColdstorage() {
        return {
            restrict: 'E',
            controller: 'BitcoinTestnetColdstorageCtrl',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceAccounts/bitcoinTestnetColdstorage/bitcoinTestnetColdstorage.html'
        };
    }
})();
