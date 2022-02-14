(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceSettings')
        .directive('bitcoinTestnetServiceSetupSubtypes', bitcoinTestnetServiceSetupSubtypes);

    /** @ngInject */
    function bitcoinTestnetServiceSetupSubtypes() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceSettings/bitcoinTestnetServiceSetupSubtypes/bitcoinTestnetServiceSetupSubtypes.html'
        };
    }
})();
