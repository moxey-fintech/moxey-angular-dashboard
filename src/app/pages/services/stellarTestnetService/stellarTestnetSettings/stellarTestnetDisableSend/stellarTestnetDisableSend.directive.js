(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetSettings')
        .directive('stellarTestnetDisableSend', stellarTestnetDisableSend);

    /** @ngInject */
    function stellarTestnetDisableSend() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetSettings/stellarTestnetDisableSend/stellarTestnetDisableSend.html'
        };
    }
})();
