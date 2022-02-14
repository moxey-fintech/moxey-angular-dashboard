(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceSettings')
        .directive('ethereumDeactivation', ethereumDeactivation);

    /** @ngInject */
    function ethereumDeactivation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceSettings/ethereumDeactivation/ethereumDeactivation.html'
        };
    }
})();
