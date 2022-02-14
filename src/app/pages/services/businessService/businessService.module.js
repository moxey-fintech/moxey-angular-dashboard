(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService', [ 
        "BlurAdmin.pages.services.businessService.businessServiceBusinesses", 
        "BlurAdmin.pages.services.businessService.businessServiceCategories",
        "BlurAdmin.pages.services.businessService.businessServiceSettings",
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('businessService', {
                url: '/extensions/business',
                abstract:true,
                title: 'Business extension'
            });

        $urlRouterProvider.when("/extensions/business", "/extensions/business/businesses");
    }

})();
