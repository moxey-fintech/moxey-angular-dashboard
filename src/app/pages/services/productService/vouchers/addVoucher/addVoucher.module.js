
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.createVoucher', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.createVoucher', {
                url: '/vouchers/create',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/vouchers/addVoucher/addVoucher.html',
                        controller: "AddVoucherCtrl"
                    }
                },
                title: 'Vouchers'
            });
    }

})();
