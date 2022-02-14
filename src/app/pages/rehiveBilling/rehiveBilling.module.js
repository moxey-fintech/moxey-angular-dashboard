(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rehiveBilling', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('rehiveBilling', {
                url: '/rehive-billing',
                templateUrl: 'app/pages/rehiveBilling/rehiveBilling.html',
                controller: 'RehiveBillingCtrl'
            });
    }

})();
