(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.createProduct', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.createProduct', {
                url: '/create',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/product/addProduct/addProduct.html',
                        controller: "AddProductCtrl"
                    }
                },
                title: 'Products'
            });
    }

})();
