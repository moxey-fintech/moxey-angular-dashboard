(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.billingInfo', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('settings.billingInfo', {
                url: '/billing-info',
                views: {
                    'generalSettings': {
                        templateUrl: 'app/pages/settings/billingInfo/billingInfo.html',
                        controller: "BillingInfoCtrl"
                    }
                },
                title: "Billing information"
            });
    }

})();
