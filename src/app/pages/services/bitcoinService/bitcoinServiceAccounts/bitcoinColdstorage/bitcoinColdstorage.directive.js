(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .directive('bitcoinColdstorage', bitcoinColdstorage);

    /** @ngInject */
    function bitcoinColdstorage() {
        return {
            restrict: 'E',
            controller: 'BitcoinColdstorageCtrl',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinColdstorage/bitcoinColdstorage.html'
        };
    }
})();
