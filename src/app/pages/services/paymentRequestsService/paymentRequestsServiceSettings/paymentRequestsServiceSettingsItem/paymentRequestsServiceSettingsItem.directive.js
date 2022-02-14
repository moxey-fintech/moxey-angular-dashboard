(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.paymentRequestsService.paymentRequestsServiceSettings')
        .directive('paymentRequestsServiceSettingsItem', paymentRequestsServiceSettingsItem);

    /** @ngInject */
    function paymentRequestsServiceSettingsItem() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/paymentRequestsService/paymentRequestsServiceSettings/paymentRequestsServiceSettingsItem/paymentRequestsServiceSettingsItem.html'
        };
    }
})();
