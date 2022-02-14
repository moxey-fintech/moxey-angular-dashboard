(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceSettings')
        .directive('bitcoinTestnetHdKeys', bitcoinTestnetHdKeys);

    /** @ngInject */
    function bitcoinTestnetHdKeys() {
        return {
            restrict: 'E',
            controller: 'BitcoinTestnetHdKeysCtrl',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceSettings/bitcoinTestnetHdKeys/bitcoinTestnetHdKeys.html'
        };
    }
})();
