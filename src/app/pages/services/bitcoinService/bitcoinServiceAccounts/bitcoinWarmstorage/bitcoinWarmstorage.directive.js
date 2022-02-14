(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .directive('bitcoinWarmstorage', bitcoinWarmstorage);

    /** @ngInject */
    function bitcoinWarmstorage() {
        return {
            restrict: 'E',
            controller: 'BitcoinWarmstorageCtrl',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinWarmstorage/bitcoinWarmstorage.html'
        };
    }
})();
