(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService', [
        'BlurAdmin.pages.services.productService.productList',
        'BlurAdmin.pages.services.productService.sellerList',
        'BlurAdmin.pages.services.productService.createProduct',
        'BlurAdmin.pages.services.productService.editProduct',
        'BlurAdmin.pages.services.productService.productSettings',
        'BlurAdmin.pages.services.productService.ordersList',
        'BlurAdmin.pages.services.productService.createOrder',
        'BlurAdmin.pages.services.productService.editOrder',
        'BlurAdmin.pages.services.productService.vouchersList',
        'BlurAdmin.pages.services.productService.createVoucher',
        'BlurAdmin.pages.services.productService.categoriesList',
        // 'BlurAdmin.pages.services.productService.createCategory',
        // 'BlurAdmin.pages.services.productService.editCategory'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService', {
                // url: '/services/product',
                url: '/extensions/product',
                abstract: true,
                templateUrl:'app/pages/services/productService/productService.html',
                controller: "ProductServiceCtrl"
            });
        // $urlRouterProvider.when("/services/product", "/services/product/list");
        $urlRouterProvider.when("/extensions/product", "/extensions/product/list");
    }

})();
