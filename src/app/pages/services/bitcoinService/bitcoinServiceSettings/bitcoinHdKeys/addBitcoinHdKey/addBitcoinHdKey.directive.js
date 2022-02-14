(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings')
        .directive('addBitcoinHdKey', addBitcoinHdKey);

    /** @ngInject */
    function addBitcoinHdKey() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceSettings/bitcoinHdKeys/addBitcoinHdKey/addBitcoinHdKey.html'
        };
    }
})();
