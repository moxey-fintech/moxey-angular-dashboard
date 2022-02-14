(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stripeService.stripeServiceSettings')
        .directive('stripeServiceDeactivation', stripeServiceDeactivation);

    /** @ngInject */
    function stripeServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stripeService/stripeServiceSettings/stripeServiceDeactivation/stripeServiceDeactivation.html'
        };
    }
})();
