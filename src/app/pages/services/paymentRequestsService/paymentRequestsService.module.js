(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.paymentRequestsService', [ 
        "BlurAdmin.pages.services.paymentRequestsService.paymentRequestsServiceSettings"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('paymentRequestsService', {
                url: '/extensions/payment-requests',
                abstract:true,
                title: 'Payment Requests Extension'
            });

        $urlRouterProvider.when("/extensions/payment-requests", "/extensions/payment-requests/settings");
    }

})();
