(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.productList', {
                url: '/list',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/product/product.html',
                        controller: "ProductCtrl"
                    }
                },
                title: 'Products'
            });
    }

})();
