(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceSettings')
        .directive('bitcoinTestnetSettings', bitcoinTestnetSettings);

    /** @ngInject */
    function bitcoinTestnetSettings() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceSettings/bitcoinTestnetSettings/bitcoinTestnetSettings.html'
        };
    }
})();
