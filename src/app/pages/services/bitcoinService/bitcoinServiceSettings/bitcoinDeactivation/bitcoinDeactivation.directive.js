(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings')
        .directive('bitcoinDeactivation', bitcoinDeactivation);

    /** @ngInject */
    function bitcoinDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceSettings/bitcoinDeactivation/bitcoinDeactivation.html'
        };
    }
})();
