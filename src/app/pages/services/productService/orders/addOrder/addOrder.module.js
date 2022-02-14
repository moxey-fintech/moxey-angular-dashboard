
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.createOrder', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.createOrder', {
                url: '/order/create',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/orders/addOrder/addOrder.html',
                        controller: "AddOrderCtrl"
                    }
                },
                title: 'Orders'
            });
    }

})();
