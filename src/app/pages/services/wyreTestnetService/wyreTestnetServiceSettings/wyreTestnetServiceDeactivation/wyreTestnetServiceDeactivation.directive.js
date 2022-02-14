(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreTestnetService.wyreTestnetServiceSettings')
        .directive('wyreTestnetServiceDeactivation', wyreTestnetServiceDeactivation);

    /** @ngInject */
    function wyreTestnetServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/wyreTestnetService/wyreTestnetServiceSettings/wyreTestnetServiceDeactivation/wyreTestnetServiceDeactivation.html'
        };
    }
})();
