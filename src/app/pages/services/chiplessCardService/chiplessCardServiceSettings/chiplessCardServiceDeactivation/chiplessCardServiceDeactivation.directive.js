(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceSettings')
        .directive('chiplessCardServiceDeactivation', chiplessCardServiceDeactivation);

    /** @ngInject */
    function chiplessCardServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/chiplessCardService/chiplessCardServiceSettings/chiplessCardServiceDeactivation/chiplessCardServiceDeactivation.html'
        };
    }
})();
