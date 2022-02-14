(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stripeService', [
        "BlurAdmin.pages.services.stripeService.stripeServicePayments",
        "BlurAdmin.pages.services.stripeService.stripeServiceSettings",
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stripeService', {
                url: '/extensions/stripe',
                abstract:true,
                title: 'Stripe extension'
            });

        $urlRouterProvider.when("/extensions/stripe", "/extensions/stripe/payments");
    }

})();
