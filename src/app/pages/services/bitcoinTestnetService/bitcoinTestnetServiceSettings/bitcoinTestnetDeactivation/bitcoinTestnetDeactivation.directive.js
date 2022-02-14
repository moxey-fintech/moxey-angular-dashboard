(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceSettings')
        .directive('bitcoinTestnetDeactivation', bitcoinTestnetDeactivation);

    /** @ngInject */
    function bitcoinTestnetDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceSettings/bitcoinTestnetDeactivation/bitcoinTestnetDeactivation.html'
        };
    }
})();
