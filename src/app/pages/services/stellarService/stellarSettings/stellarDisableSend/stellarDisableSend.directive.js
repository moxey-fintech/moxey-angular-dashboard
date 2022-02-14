(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarSettings')
        .directive('stellarDisableSend', stellarDisableSend);

    /** @ngInject */
    function stellarDisableSend() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarService/stellarSettings/stellarDisableSend/stellarDisableSend.html'
        };
    }
})();
