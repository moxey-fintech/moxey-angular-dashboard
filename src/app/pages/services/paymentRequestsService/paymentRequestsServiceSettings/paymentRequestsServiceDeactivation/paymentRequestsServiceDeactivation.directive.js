(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.paymentRequestsService.paymentRequestsServiceSettings')
        .directive('paymentRequestsServiceDeactivation', paymentRequestsServiceDeactivation);

    /** @ngInject */
    function paymentRequestsServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/paymentRequestsService/paymentRequestsServiceSettings/paymentRequestsServiceDeactivation/paymentRequestsServiceDeactivation.html'
        };
    }
})();
