(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarSettings')
        .directive('stellarDeactivation', stellarDeactivation);

    /** @ngInject */
    function stellarDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarService/stellarSettings/stellarDeactivation/stellarDeactivation.html'
        };
    }
})();
