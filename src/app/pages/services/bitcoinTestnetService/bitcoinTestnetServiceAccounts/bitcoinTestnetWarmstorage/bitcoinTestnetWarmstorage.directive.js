(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceAccounts')
        .directive('bitcoinTestnetWarmstorage', bitcoinTestnetWarmstorage);

    /** @ngInject */
    function bitcoinTestnetWarmstorage() {
        return {
            restrict: 'E',
            controller: 'BitcoinTestnetWarmstorageCtrl',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceAccounts/bitcoinTestnetWarmstorage/bitcoinTestnetWarmstorage.html'
        };
    }
})();
