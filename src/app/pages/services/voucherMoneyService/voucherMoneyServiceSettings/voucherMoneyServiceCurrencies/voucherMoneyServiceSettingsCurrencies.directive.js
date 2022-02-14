(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.voucherMoneyService.voucherMoneyServiceSettings')
        .directive('voucherMoneyServiceSettingsCurrencies', voucherMoneyServiceSettingsCurrencies);

    /** @ngInject */
    function voucherMoneyServiceSettingsCurrencies() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/voucherMoneyService/voucherMoneyServiceSettings/voucherMoneyServiceCurrencies/voucherMoneyServiceSettingsCurrencies.html'
        };
    }
})();