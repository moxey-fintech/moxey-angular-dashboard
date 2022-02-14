(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.categoriesList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.categoriesList', {
                url: '/categories',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/categories/productCategories.html',
                        controller: "ProductCategoriesCtrl"
                    }
                },
                params: {
                    openAddCategory: null
                },
                title: 'Categories'
            });
    }

})();
