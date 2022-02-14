(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.krakenService.krakenServiceSettings')
        .directive('krakenServiceDeactivation', krakenServiceDeactivation);

    /** @ngInject */
    function krakenServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/krakenService/krakenServiceSettings/krakenServiceDeactivation/krakenServiceDeactivation.html'
        };
    }
})();
