(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetSettings')
        .directive('stellarTestnetDeactivation', stellarTestnetDeactivation);

    /** @ngInject */
    function stellarTestnetDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetSettings/stellarTestnetDeactivation/stellarTestnetDeactivation.html'
        };
    }
})();
