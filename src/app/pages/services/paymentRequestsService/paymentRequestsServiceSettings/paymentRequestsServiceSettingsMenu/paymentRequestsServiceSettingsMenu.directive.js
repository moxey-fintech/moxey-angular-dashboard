(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.paymentRequestsService.paymentRequestsServiceSettings')
        .directive('paymentRequestsServiceSettingsMenu', paymentRequestsServiceSettingsMenu);

    /** @ngInject */
    function paymentRequestsServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/paymentRequestsService/paymentRequestsServiceSettings/paymentRequestsServiceSettingsMenu/paymentRequestsServiceSettingsMenu.html'
        };
    }
})();
