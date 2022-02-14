(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceSettings')
        .directive('bitcoinTestnetServiceUserDefaults', bitcoinTestnetServiceUserDefaults);

    /** @ngInject */
    function bitcoinTestnetServiceUserDefaults() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceSettings/bitcoinTestnetServiceUserDefaults/bitcoinTestnetServiceUserDefaults.html'
        };
    }
})();
