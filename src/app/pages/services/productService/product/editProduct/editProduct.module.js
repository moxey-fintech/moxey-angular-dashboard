(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.editProduct', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.editProduct', {
                url: '/edit/:productId',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/product/editProduct/editProduct.html',
                        controller: "EditProductCtrl"
                    }
                },
                title: 'Products'
            });
    }

})();
