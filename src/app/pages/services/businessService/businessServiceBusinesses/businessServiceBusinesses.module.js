(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceBusinesses', [
        'BlurAdmin.pages.services.businessService.businessServiceBusinessView'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('businessServiceBusinesses', {
                url: '/extensions/business/businesses',
                templateUrl: 'app/pages/services/businessService/businessServiceBusinesses/businessServiceBusinesses.html',
                controller: "BusinessServiceBusinessesCtrl",
                title: 'Businesses'
            });
    }

})();

