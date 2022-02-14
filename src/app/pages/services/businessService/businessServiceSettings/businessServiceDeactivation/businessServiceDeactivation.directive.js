(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceSettings')
        .directive('businessServiceDeactivation', businessServiceDeactivation);

    /** @ngInject */
    function businessServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/businessService/businessServiceSettings/businessServiceDeactivation/businessServiceDeactivation.html'
        };
    }
})();
