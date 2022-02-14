(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.voucherMoneyService.voucherMoneyServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('voucherMoneyServiceSettings', {
                url: '/extensions/vouchermoney/settings',
                templateUrl: 'app/pages/services/voucherMoneyService/voucherMoneyServiceSettings/voucherMoneyServiceSettings.html',
                controller: "VoucherMoneyServiceSettingsCtrl",
                title: 'Settings'
            });
    }

})();
