(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.krakenService.krakenServiceSettings')
        .directive('krakenServiceSettingsExchangePairs', krakenServiceSettingsExchangePairs);

    /** @ngInject */
    function krakenServiceSettingsExchangePairs() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/krakenService/krakenServiceSettings/krakenServiceExchangePairs/krakenServiceSettingsExchangePairs.html'
        };
    }
})();