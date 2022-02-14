(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stripeService.stripeServicePayments', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stripeServicePayments', {
                url: '/extensions/stripe/payments',
                templateUrl: 'app/pages/services/stripeService/stripeServicePayments/stripeServicePayments.html',
                controller: "StripeServicePaymentsCtrl",
                title: 'Payments'
            });
    }

})();

