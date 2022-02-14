(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings')
        .directive('bitcoinSettings', bitcoinSettings);

    /** @ngInject */
    function bitcoinSettings() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceSettings/bitcoinSettings/bitcoinSettings.html'
        };
    }
})();
