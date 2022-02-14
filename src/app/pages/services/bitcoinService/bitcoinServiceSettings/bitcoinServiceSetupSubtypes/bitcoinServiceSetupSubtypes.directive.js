(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings')
        .directive('bitcoinServiceSetupSubtypes', bitcoinServiceSetupSubtypes);

    /** @ngInject */
    function bitcoinServiceSetupSubtypes() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceSettings/bitcoinServiceSetupSubtypes/bitcoinServiceSetupSubtypes.html'
        };
    }
})();
