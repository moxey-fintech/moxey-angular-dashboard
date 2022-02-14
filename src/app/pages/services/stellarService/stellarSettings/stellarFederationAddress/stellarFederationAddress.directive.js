(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarSettings')
        .directive('stellarFedarationAddress', stellarFedarationAddress);

    /** @ngInject */
    function stellarFedarationAddress() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarSettings/stellarFederationAddress/stellarFederationAddress.html'
        };
    }
})();
