(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.paymentRequestsService.paymentRequestsServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('paymentRequestsServiceSettings', {
                url: '/extensions/payment-requests/settings',
                templateUrl: 'app/pages/services/paymentRequestsService/paymentRequestsServiceSettings/paymentRequestsServiceSettings.html',
                controller: "PaymentRequestsServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
