
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.editOrder', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.editOrder', {
                url: '/order/edit/:orderId',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/orders/editOrder/editOrder.html',
                        controller: "EditOrderCtrl"
                    }
                },
                title: 'Orders'
            });
    }

})();
