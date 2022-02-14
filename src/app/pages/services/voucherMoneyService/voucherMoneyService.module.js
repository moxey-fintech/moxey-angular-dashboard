(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.voucherMoneyService', [
        "BlurAdmin.pages.services.voucherMoneyService.voucherMoneyServiceSettings"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('voucherMoneyService', {
                url: '/extensions/vouchermoney',
                abstract:true,
                title: 'VoucherMoney extension'
            });

        $urlRouterProvider.when("/extensions/vouchermoney", "/extensions/vouchermoney/settings");
    }

})();
