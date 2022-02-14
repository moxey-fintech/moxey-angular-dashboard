(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceBusinessView', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('businessServiceBusinessView', {
                url: '/extensions/business/businesses/:business_id',
                templateUrl: 'app/pages/services/businessService/businessServiceBusinesses/businessServiceBusinessView/businessServiceBusinessView.html',
                controller: "BusinessServiceBusinessViewCtrl",
                title: 'Businesses'
            });
    }

})();