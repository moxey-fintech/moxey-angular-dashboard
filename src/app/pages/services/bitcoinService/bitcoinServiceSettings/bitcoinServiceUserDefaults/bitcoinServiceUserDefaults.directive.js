(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings')
        .directive('bitcoinServiceUserDefaults', bitcoinServiceUserDefaults);

    /** @ngInject */
    function bitcoinServiceUserDefaults() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceSettings/bitcoinServiceUserDefaults/bitcoinServiceUserDefaults.html'
        };
    }
})();
