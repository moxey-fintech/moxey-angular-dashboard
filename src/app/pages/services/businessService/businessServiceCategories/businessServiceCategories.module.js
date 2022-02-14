(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceCategories', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('businessServiceCategories', {
                url: '/extensions/business/categories',
                templateUrl: 'app/pages/services/businessService/businessServiceCategories/businessServiceCategories.html',
                controller: "BusinessServiceCategoriesCtrl",
                title: 'Categories'
            });
    }

})();
