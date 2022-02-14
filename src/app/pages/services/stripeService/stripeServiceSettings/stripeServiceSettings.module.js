(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stripeService.stripeServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stripeServiceSettings', {
                url: '/extensions/stripe/settings',
                templateUrl: 'app/pages/services/stripeService/stripeServiceSettings/stripeServiceSettings.html',
                controller: "StripeServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
