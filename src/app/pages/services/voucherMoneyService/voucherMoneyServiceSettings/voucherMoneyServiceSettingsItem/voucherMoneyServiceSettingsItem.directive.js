(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.voucherMoneyService.voucherMoneyServiceSettings')
        .directive('voucherMoneyServiceSettingsItem', voucherMoneyServiceSettingsItem);

    /** @ngInject */
    function voucherMoneyServiceSettingsItem() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/voucherMoneyService/voucherMoneyServiceSettings/voucherMoneyServiceSettingsItem/voucherMoneyServiceSettingsItem.html'
        };
    }
})();
