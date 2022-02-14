(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetSettings')
        .directive('stellarTestnetFederationAddress', stellarTestnetFederationAddress);

    /** @ngInject */
    function stellarTestnetFederationAddress() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetSettings/stellarTestnetFederationAddress/stellarTestnetFederationAddress.html'
        };
    }
})();
