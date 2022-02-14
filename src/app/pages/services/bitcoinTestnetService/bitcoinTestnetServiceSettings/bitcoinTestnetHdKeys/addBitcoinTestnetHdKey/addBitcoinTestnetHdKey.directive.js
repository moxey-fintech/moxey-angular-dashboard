(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceSettings')
        .directive('addBitcoinTestnetHdKey', addBitcoinTestnetHdKey);

    /** @ngInject */
    function addBitcoinTestnetHdKey() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceSettings/bitcoinTestnetHdKeys/addBitcoinTestnetHdKey/addBitcoinTestnetHdKey.html'
        };
    }
})();
