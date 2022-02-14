(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.vouchersList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.vouchersList', {
                url: '/vouchers',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/vouchers/vouchers.html',
                        controller: "VouchersCtrl"
                    }
                },
                params: {
                    productId: null
                },
                title: 'Vouchers'
            });
    }

})();
