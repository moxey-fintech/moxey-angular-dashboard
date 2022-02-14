(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings')
        .directive('bitcoinHdKeys', bitcoinHdKeys);

    /** @ngInject */
    function bitcoinHdKeys() {
        return {
            restrict: 'E',
            controller: 'BitcoinHdKeysCtrl',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceSettings/bitcoinHdKeys/bitcoinHdKeys.html'
        };
    }
})();
