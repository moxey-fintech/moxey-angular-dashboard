(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.flashService.flashServiceSettings')
        .directive('flashServiceDeactivation', flashServiceDeactivation);

    /** @ngInject */
    function flashServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/flashService/flashServiceSettings/flashServiceDeactivation/flashServiceDeactivation.html'
        };
    }
})();
