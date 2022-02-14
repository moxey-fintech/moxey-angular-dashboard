(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.ordersList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.ordersList', {
                url: '/orders',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/orders/orders.html',
                        controller: "OrdersCtrl"
                    }
                },
                params: {
                    openPurchaseOrder: null
                },
                title: 'Orders'
            });
    }

})();
